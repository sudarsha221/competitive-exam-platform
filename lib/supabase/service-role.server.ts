import "server-only";

import { createClient } from "@supabase/supabase-js";
import { isSafeSupabaseUrl } from "@/lib/supabase/url";

export function createServiceRoleClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!isSafeSupabaseUrl(url) || !serviceRoleKey) {
    throw new Error("Supabase server registration is not configured.");
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      detectSessionInUrl: false,
      persistSession: false,
    },
  });
}
