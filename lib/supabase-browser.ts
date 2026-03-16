import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/types/database";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseKey && typeof window !== "undefined") {
  // eslint-disable-next-line no-console
  console.warn("Supabase environment variables are not set");
}

let client: ReturnType<typeof createBrowserClient<Database>> | undefined;

export function createBrowserSupabaseClient() {
  if (client) return client;
  client = createBrowserClient<Database>(supabaseUrl, supabaseKey);
  return client;
}

