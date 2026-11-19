import { createClient, type User } from "@supabase/supabase-js";
import { normalizeRegistrationPhone } from "@/lib/auth/registration-validation";
import { createServiceRoleClient } from "@/lib/supabase/service-role.server";
import { isSafeSupabaseUrl } from "@/lib/supabase/url";
import type { AdminTeacher, TeacherExam, TeacherStatus } from "@/components/admin/teacher-data";
import { teacherExams } from "@/components/admin/teacher-data";

const accountStatuses: Record<TeacherStatus, "active" | "inactive"> = {
  Active: "active",
  Inactive: "inactive",
};
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const authUserPageSize = 1000;
const maxAuthUserPages = 100;

function errorResponse(error: string, status: number) {
  return Response.json({ error }, { status, headers: { "Cache-Control": "no-store" } });
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isTeacherExam(value: unknown): value is TeacherExam {
  return typeof value === "string" && (teacherExams as readonly string[]).includes(value);
}

async function authenticateAdmin(request: Request) {
  const accessToken = request.headers
    .get("authorization")
    ?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!accessToken || accessToken.length > 8192) {
    return { response: errorResponse("An active Admin session is required.", 401) } as const;
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!isSafeSupabaseUrl(supabaseUrl) || !anonKey) {
    return { response: errorResponse("Supabase is not configured.", 503) } as const;
  }

  const userClient = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });

  try {
    const { data: authData, error: authError } = await userClient.auth.getUser(accessToken);
    if (authError || !authData.user) {
      return { response: errorResponse("The Admin session is invalid or expired.", 401) } as const;
    }
    if (!authData.user.email_confirmed_at) {
      return { response: errorResponse("Verify your email before managing teachers.", 403) } as const;
    }

    const [profileResult, rolesResult] = await Promise.all([
      userClient
        .from("profiles")
        .select("account_status")
        .eq("id", authData.user.id)
        .maybeSingle(),
      userClient
        .from("user_roles")
        .select("role")
        .eq("user_id", authData.user.id),
    ]);

    if (profileResult.error || rolesResult.error) {
      console.error(
        "Teacher management authorization lookup failed.",
        profileResult.error?.code ?? rolesResult.error?.code,
      );
      return { response: errorResponse("Admin access could not be verified.", 503) } as const;
    }
    if (
      profileResult.data?.account_status !== "active" ||
      !rolesResult.data.some((row) => row.role === "admin")
    ) {
      return { response: errorResponse("An active Admin role is required.", 403) } as const;
    }

    return { accessToken, userId: authData.user.id, userClient } as const;
  } catch (error) {
    console.error(
      "Teacher management authorization failed.",
      error instanceof Error ? error.message : "Unknown authorization error",
    );
    return { response: errorResponse("Admin access could not be verified.", 503) } as const;
  }
}

async function listAuthUsersByEmail(
  serviceClient: ReturnType<typeof createServiceRoleClient>,
  normalizedEmail: string,
): Promise<User | null> {
  for (let page = 1; page <= maxAuthUserPages; page += 1) {
    const { data, error } = await serviceClient.auth.admin.listUsers({
      page,
      perPage: authUserPageSize,
    });
    if (error) throw error;

    const user = data.users.find(
      (candidate) => candidate.email?.toLowerCase() === normalizedEmail,
    );
    if (user) return user;
    if (data.users.length < authUserPageSize) return null;
  }

  throw new Error("Auth user search reached its safe pagination limit.");
}

async function isExistingTeacher(
  serviceClient: ReturnType<typeof createServiceRoleClient>,
  userId: string,
) {
  const [profileResult, roleResult] = await Promise.all([
    serviceClient
      .from("teacher_profiles")
      .select("user_id")
      .eq("user_id", userId)
      .maybeSingle(),
    serviceClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userId)
      .eq("role", "teacher")
      .maybeSingle(),
  ]);
  if (profileResult.error || roleResult.error) {
    throw profileResult.error ?? roleResult.error;
  }
  return Boolean(profileResult.data && roleResult.data);
}

function invitationRedirectUrl() {
  const appBaseUrl = process.env.APP_BASE_URL;
  if (!isSafeSupabaseUrl(appBaseUrl)) return null;

  const base = new URL(appBaseUrl);
  if (base.username || base.password) return null;
  return new URL("/auth/invite", base.origin).toString();
}

async function loadTeachers(
  serviceClient: ReturnType<typeof createServiceRoleClient>,
): Promise<AdminTeacher[]> {
  const teacherProfilesResult = await serviceClient
    .from("teacher_profiles")
    .select("user_id, teacher_code, created_at")
    .order("created_at", { ascending: false });
  if (teacherProfilesResult.error) throw teacherProfilesResult.error;

  const teacherProfileRows = teacherProfilesResult.data ?? [];
  if (teacherProfileRows.length === 0) return [];

  const userIds = teacherProfileRows.map((row) => row.user_id);
  const [profilesResult, rolesResult, assignmentsResult, examsResult] = await Promise.all([
    serviceClient
      .from("profiles")
      .select("id, display_name, phone_e164, account_status, created_at")
      .in("id", userIds),
    serviceClient
      .from("user_roles")
      .select("user_id")
      .eq("role", "teacher")
      .in("user_id", userIds),
    serviceClient
      .from("teacher_exam_assignments")
      .select("teacher_user_id, exam_id")
      .in("teacher_user_id", userIds),
    serviceClient.from("exams").select("id, name"),
  ]);

  const queryError =
    profilesResult.error ??
    rolesResult.error ??
    assignmentsResult.error ??
    examsResult.error;
  if (queryError) throw queryError;

  const profilesById = new Map((profilesResult.data ?? []).map((profile) => [profile.id, profile]));
  const teacherRoleIds = new Set((rolesResult.data ?? []).map((row) => row.user_id));
  const examsById = new Map((examsResult.data ?? []).map((exam) => [exam.id, exam.name]));
  const assignmentsByTeacher = new Map<string, TeacherExam[]>();
  for (const assignment of assignmentsResult.data ?? []) {
    const examName = examsById.get(assignment.exam_id);
    if (!isTeacherExam(examName)) continue;
    const current = assignmentsByTeacher.get(assignment.teacher_user_id) ?? [];
    current.push(examName);
    assignmentsByTeacher.set(assignment.teacher_user_id, current);
  }

  const teachers = await Promise.all(
    teacherProfileRows
      .filter((row) => teacherRoleIds.has(row.user_id))
      .map(async (row): Promise<AdminTeacher> => {
        const profile = profilesById.get(row.user_id);
        if (!profile) throw new Error("Teacher profile data is incomplete.");

        const { data, error } = await serviceClient.auth.admin.getUserById(row.user_id);
        if (error || !data.user?.email) {
          throw error ?? new Error("Teacher Auth email is unavailable.");
        }

        const joinedAt = profile.created_at.slice(0, 10);
        return {
          id: row.teacher_code,
          name: profile.display_name,
          email: data.user.email,
          phone: profile.phone_e164 ?? "",
          exams: assignmentsByTeacher.get(row.user_id) ?? [],
          status: profile.account_status === "active" ? "Active" : "Inactive",
          joinedAt,
          activity: [{ label: "Teacher account created", date: joinedAt }],
        };
      }),
  );
  return teachers;
}

export async function GET(request: Request) {
  const authorization = await authenticateAdmin(request);
  if ("response" in authorization) return authorization.response;

  try {
    const teachers = await loadTeachers(createServiceRoleClient());
    return Response.json({ teachers }, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    console.error(
      "Teacher list could not be loaded.",
      error instanceof Error ? error.message : "Unknown database error",
    );
    return errorResponse("Teacher records could not be loaded.", 503);
  }
}

export async function POST(request: Request) {
  const authorization = await authenticateAdmin(request);
  if ("response" in authorization) return authorization.response;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return errorResponse("The teacher details are not valid JSON.", 400);
  }
  if (!isRecord(payload)) return errorResponse("Teacher details are required.", 400);

  const name = typeof payload.name === "string" ? payload.name.trim() : "";
  const email = typeof payload.email === "string" ? payload.email.trim().toLowerCase() : "";
  const phoneInput = typeof payload.phone === "string" ? payload.phone : "";
  const phone = normalizeRegistrationPhone(phoneInput);
  const status = payload.status;
  const exams = payload.exams;

  if (name.length < 2 || name.length > 100) {
    return errorResponse("Enter a full name between 2 and 100 characters.", 400);
  }
  if (email.length > 254 || !emailPattern.test(email)) {
    return errorResponse("Enter a valid email address.", 400);
  }
  if (!phone) return errorResponse("Enter a valid phone number.", 400);
  if (status !== "Active" && status !== "Inactive") {
    return errorResponse("Select a valid account status.", 400);
  }
  if (
    !Array.isArray(exams) ||
    exams.length === 0 ||
    exams.some((exam) => !isTeacherExam(exam)) ||
    new Set(exams).size !== exams.length
  ) {
    return errorResponse("Assign one or more valid examinations.", 400);
  }
  const selectedExams = exams.filter(isTeacherExam);

  const redirectTo = invitationRedirectUrl();
  if (!redirectTo) {
    return errorResponse("Set a valid APP_BASE_URL before sending teacher invitations.", 503);
  }

  let serviceClient: ReturnType<typeof createServiceRoleClient>;
  try {
    serviceClient = createServiceRoleClient();
  } catch (error) {
    console.error(
      "Teacher invitation service is not configured.",
      error instanceof Error ? error.message : "Unknown configuration error",
    );
    return errorResponse("Teacher invitations are not configured.", 503);
  }

  let existingUser: User | null;
  try {
    existingUser = await listAuthUsersByEmail(serviceClient, email);
  } catch (error) {
    console.error(
      "Existing Auth account lookup failed.",
      error instanceof Error ? error.message : "Unknown Auth lookup error",
    );
    return errorResponse("The email address could not be checked. No invitation was sent.", 503);
  }

  if (existingUser) {
    try {
      if (
        !existingUser.email_confirmed_at &&
        await isExistingTeacher(serviceClient, existingUser.id)
      ) {
        return Response.json({
          success: true,
          alreadyInvited: true,
          message: "An unconfirmed teacher account already exists for this email; no duplicate was created.",
        });
      }
    } catch (error) {
      console.error(
        "Existing teacher account lookup failed.",
        error instanceof Error ? error.message : "Unknown profile lookup error",
      );
      return errorResponse("The existing account could not be checked.", 503);
    }
    return errorResponse("An Auth account already uses this email. No account or role was changed.", 409);
  }

  let invitedUser: User;
  try {
    const { data, error } = await serviceClient.auth.admin.inviteUserByEmail(email, {
      data: { display_name: name, phone_e164: phone },
      redirectTo,
    });
    if (error || !data.user) {
      console.error("Supabase could not create the teacher invitation.", error?.code ?? "missing_user");
      return errorResponse(
        "The invitation outcome could not be confirmed. Check Auth users before retrying.",
        503,
      );
    }
    invitedUser = data.user;
  } catch (error) {
    console.error(
      "Supabase teacher invitation failed.",
      error instanceof Error ? error.message : "Unknown Auth error",
    );
    return errorResponse(
      "The invitation outcome could not be confirmed. Check Auth users before retrying.",
      503,
    );
  }

  let provisioningFailed = false;
  try {
    const { error: provisioningError } = await authorization.userClient.rpc(
      "admin_provision_teacher",
      {
        p_user_id: invitedUser.id,
        p_display_name: name,
        p_phone_e164: phone,
        p_account_status: accountStatuses[status],
        p_exam_names: selectedExams,
      },
    );
    if (provisioningError) {
      provisioningFailed = true;
      console.error("Teacher database provisioning failed.", provisioningError.code);
    }
  } catch (error) {
    provisioningFailed = true;
    console.error(
      "Teacher database provisioning request failed.",
      error instanceof Error ? error.message : "Unknown RPC error",
    );
  }

  if (provisioningFailed) {
    let cleanupFailed = false;
    try {
      const { error: cleanupError } = await serviceClient.auth.admin.deleteUser(invitedUser.id);
      if (cleanupError) {
        cleanupFailed = true;
        console.error("Unprovisioned teacher Auth account cleanup failed.", cleanupError.code);
      }
    } catch (error) {
      cleanupFailed = true;
      console.error(
        "Unprovisioned teacher Auth account cleanup request failed.",
        error instanceof Error ? error.message : "Unknown cleanup error",
      );
    }
    if (cleanupFailed) {
      return errorResponse(
        "The invitation was sent, but account setup did not finish. An administrator must review this account before retrying.",
        503,
      );
    }
    return errorResponse(
      "Teacher account setup failed. The new Auth account was removed; you can safely retry.",
      503,
    );
  }

  return Response.json(
    {
      success: true,
      alreadyInvited: false,
      message: `An invitation was sent to ${email}.`,
    },
    { status: 201, headers: { "Cache-Control": "no-store" } },
  );
}
