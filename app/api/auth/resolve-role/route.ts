import { createClient } from "@supabase/supabase-js";
import { isSafeSupabaseUrl } from "@/lib/supabase/url";

const roleDestinations = {
  admin: "/admin/dashboard",
  teacher: "/teacher/dashboard",
  student: "/student/dashboard",
} as const;

type AppRole = keyof typeof roleDestinations;

function errorResponse(error: string, status: number) {
  return Response.json({ error }, { status });
}

export async function GET(request: Request) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!isSafeSupabaseUrl(supabaseUrl) || !anonKey) {
    return errorResponse("Sign-in is not configured. Please try again later.", 503);
  }

  const accessToken = request.headers
    .get("authorization")
    ?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!accessToken || accessToken.length > 8192) {
    return errorResponse("Your session is invalid or has expired. Please sign in again.", 401);
  }

  const supabase = createClient(supabaseUrl, anonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });

  try {
    const { data: authData, error: authError } = await supabase.auth.getUser(accessToken);
    if (authError || !authData.user) {
      return errorResponse("Your session is invalid or has expired. Please sign in again.", 401);
    }

    if (!authData.user.email_confirmed_at) {
      return errorResponse("Verify your email before signing in.", 403);
    }

    const [profileResult, rolesResult] = await Promise.all([
      supabase
        .from("profiles")
        .select("account_status")
        .eq("id", authData.user.id)
        .maybeSingle(),
      supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", authData.user.id),
    ]);

    if (profileResult.error || rolesResult.error) {
      console.error(
        "Sign-in authorization lookup failed.",
        profileResult.error?.code ?? rolesResult.error?.code,
      );
      return errorResponse("Your account access could not be checked. Please try again.", 503);
    }

    if (!profileResult.data || profileResult.data.account_status !== "active") {
      return errorResponse("This account is inactive or is not provisioned for access.", 403);
    }

    const roles = new Set(
      rolesResult.data
        .map((row) => row.role)
        .filter((role): role is AppRole => role in roleDestinations),
    );
    const role = (["admin", "teacher", "student"] as const).find((candidate) =>
      roles.has(candidate),
    );
    if (!role) {
      return errorResponse("This account is not provisioned for access.", 403);
    }

    if (role === "teacher" || role === "student") {
      const profileTable = role === "teacher" ? "teacher_profiles" : "student_profiles";
      const { data: roleProfile, error: roleProfileError } = await supabase
        .from(profileTable)
        .select("user_id")
        .eq("user_id", authData.user.id)
        .maybeSingle();

      if (roleProfileError) {
        console.error("Sign-in role profile lookup failed.", roleProfileError.code);
        return errorResponse("Your account access could not be checked. Please try again.", 503);
      }
      if (!roleProfile) {
        return errorResponse("This account is not provisioned for access.", 403);
      }
    }

    return Response.json({ redirectTo: roleDestinations[role] });
  } catch (error) {
    console.error("Sign-in authorization request failed.", error);
    return errorResponse("Could not reach the authentication service. Please try again.", 503);
  }
}
