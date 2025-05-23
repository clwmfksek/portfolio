import { supabase } from "./supabaseClient";

export async function isAdmin(email: string) {
  const { data, error } = await supabase
    .from("admin_users")
    .select("id")
    .eq("email", email)
    .single();
  return !!data && !error;
}
