"use server";

import "server-only";
// import { revalidatePath } from "next/cache";
import { supabase } from "./supabase";
import { Database } from "@/types/database";
import { auth, currentUser } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function getCurrentUser() {
  const user = await currentUser();
  if (!user) return null;

  return {
    id: user.id,
    email: user.emailAddresses[0]?.emailAddress,
    name: user.firstName || user.username || "User",
    created_at: user.createdAt,
  };
}

export async function getUserInfo(
  id: string
): Promise<Database["public"]["Tables"]["users"]["Row"] | null> {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("users")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") return null;
    throw error;
  }
  return data;
}

export async function updateUserInfo(
  id: string,
  field: "name" | "email",
  newValue: string
): Promise<Database["public"]["Tables"]["users"]["Row"]> {
  const { userId } = await auth();

  if (id != userId) {
    throw new Error("You do not have access to update user");
  }

  if (!newValue) throw new Error("New Value is empty");

  const updatePayload =
    field === "name" ? { name: newValue } : { email: newValue };

  const { data, error } = await supabase
    .from("users")
    // @ts-ignore
    .update(updatePayload)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;

  revalidatePath("/profile");

  return data;
}
