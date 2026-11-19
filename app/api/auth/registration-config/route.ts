import { connection } from "next/server";
import { isSafeSupabaseUrl } from "@/lib/supabase/url";

export async function GET() {
  await connection();

  const configured =
    isSafeSupabaseUrl(process.env.NEXT_PUBLIC_SUPABASE_URL) &&
    Boolean(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) &&
    Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY);

  return Response.json(
    { configured },
    { headers: { "Cache-Control": "no-store" } },
  );
}
