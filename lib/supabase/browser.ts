"use client";

import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import { isSafeSupabaseUrl } from "@/lib/supabase/url";

let client: SupabaseClient | undefined;

export function getSupabaseBrowserClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!isSafeSupabaseUrl(url) || !anonKey) {
    throw new Error("Supabase registration is not configured.");
  }

  if (!client) {
    client = createClient(url, anonKey, {
      auth: {
        flowType: "pkce",
        detectSessionInUrl: true,
        persistSession: true,
        autoRefreshToken: true,
      },
    });
  }

  return client;
}
