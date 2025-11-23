import { supabase } from "./supabase";
import { Database } from "@/types/database";

export async function getCurrentSession() {
  const { data: sessionData, error: errorData } =
    await supabase.auth.getSession();
  if (errorData) throw errorData;

  console.log(sessionData);
  return sessionData;
}
