import { createClient } from "@supabase/supabase-js";
import { normalizeRegistrationPhone } from "@/lib/auth/registration-validation";
import { createServiceRoleClient } from "@/lib/supabase/service-role.server";
import { isSafeSupabaseUrl } from "@/lib/supabase/url";

const examNames: Record<string, string> = {
  CET: "KCET",
  NEET: "NEET",
  JEE: "JEE Main",
};

function errorResponse(message: string, status: number) {
  return Response.json({ error: message }, { status });
}

export async function POST(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!isSafeSupabaseUrl(supabaseUrl) || !anonKey || !serviceRoleKey) {
    return errorResponse("Student registration is not configured.", 503);
  }

  const authorization = request.headers.get("authorization");
  const accessToken = authorization?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!accessToken || accessToken.length > 8192) {
    return errorResponse("A valid student session is required.", 401);
  }

  const authClient = createClient(supabaseUrl, anonKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });

  let authResult;
  try {
    authResult = await authClient.auth.getUser(accessToken);
  } catch (error) {
    console.error("Student registration identity verification failed.", error);
    return errorResponse("Could not verify the student session. Please try again.", 503);
  }

  const user = authResult.data.user;
  if (authResult.error || !user) {
    return errorResponse("The student session is invalid or expired.", 401);
  }
  if (!user.email_confirmed_at) {
    return errorResponse("Verify your email before completing registration.", 403);
  }

  const metadata = user.user_metadata;
  const displayName =
    typeof metadata.display_name === "string" ? metadata.display_name.trim() : "";
  const phone =
    typeof metadata.phone_e164 === "string"
      ? normalizeRegistrationPhone(metadata.phone_e164)
      : null;
  const examSelection =
    typeof metadata.registration_exam === "string"
      ? metadata.registration_exam
      : "";
  const examName = examNames[examSelection];

  if (displayName.length < 2 || displayName.length > 100 || !phone || !examName) {
    return errorResponse("Registration details are incomplete or invalid.", 400);
  }

  const serviceClient = createServiceRoleClient();
  let examResult;
  try {
    examResult = await serviceClient
      .from("exams")
      .select("id")
      .eq("name", examName)
      .eq("is_active", true)
      .maybeSingle();
  } catch (error) {
    console.error("Student registration exam lookup failed.", error);
    return errorResponse("Exam availability could not be checked. Please try again.", 503);
  }

  if (examResult.error) {
    console.error("Student registration exam lookup failed.", examResult.error.code);
    return errorResponse("Exam availability could not be checked. Please try again.", 503);
  }
  if (!examResult.data) {
    return errorResponse("The selected exam is not available for registration.", 422);
  }

  let provisioningResult;
  try {
    provisioningResult = await serviceClient.rpc("complete_student_registration", {
      p_user_id: user.id,
    });
  } catch (error) {
    console.error("Student account provisioning failed.", error);
    return errorResponse("Student account setup could not be completed. Please retry.", 503);
  }

  if (provisioningResult.error) {
    console.error("Student account provisioning failed.", provisioningResult.error.code);
    return errorResponse("Student account setup could not be completed. Please retry.", 503);
  }

  let profileResult;
  try {
    profileResult = await serviceClient
      .from("profiles")
      .update({ phone_e164: phone })
      .eq("id", user.id)
      .select("id")
      .maybeSingle();
  } catch (error) {
    console.error("Student profile details could not be saved.", error);
    return errorResponse("Your account is active, but profile setup is incomplete. Please retry.", 503);
  }

  if (profileResult.error || !profileResult.data) {
    console.error("Student profile details could not be saved.", profileResult.error?.code);
    return errorResponse("Your account is active, but profile setup is incomplete. Please retry.", 503);
  }

  let enrollmentResult;
  try {
    enrollmentResult = await serviceClient
      .from("student_exam_enrollments")
      .upsert(
        { student_user_id: user.id, exam_id: examResult.data.id, status: "active" },
        { onConflict: "student_user_id,exam_id" },
      );
  } catch (error) {
    console.error("Student exam enrollment could not be saved.", error);
    return errorResponse("Your account is active, but exam setup is incomplete. Please retry.", 503);
  }

  if (enrollmentResult.error) {
    console.error("Student exam enrollment could not be saved.", enrollmentResult.error.code);
    return errorResponse("Your account is active, but exam setup is incomplete. Please retry.", 503);
  }

  return Response.json({ success: true });
}
