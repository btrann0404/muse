"use server";

import { supabase } from "./supabase";
import { Database } from "@/types/database";
import { auth } from "@clerk/nextjs/server";

export type Friendship = Database["public"]["Tables"]["friendships"]["Row"];

// Send a friend request
export async function sendFriendRequest(friendId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("friendships")
    .insert({
      userId,
      friendId,
      status: "pending",
    })
    .select()
    .single();

  if (error) {
    console.error("Error sending friend request:", error);
    return null;
  }
  return data;
}

// Get pending friend requests for the current user
export async function getFriendRequests() {
  const { userId } = await auth();
  if (!userId) return [];

  const { data, error } = await supabase
    .from("friendships")
    .select(
      `
      id,
      userId,
      friendId,
      status,
      created_at,
      sender:users!friendships_userId_fkey (
        id,
        name,
        email
      )
    `
    )
    .eq("friendId", userId)
    .eq("status", "pending");

  if (error) {
    console.error("Error fetching friend requests:", error);
    return [];
  }

  return data || [];
}

// Accept a friend request
export async function acceptFriendRequest(friendshipId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("friendships")
    .update({ status: "accepted" })
    .eq("id", friendshipId)
    .select()
    .single();

  if (error) {
    console.error("Error accepting friend request:", error);
    return null;
  }
  return data;
}

// Reject or cancel a friend request
export async function removeFriendship(friendshipId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { error } = await supabase
    .from("friendships")
    .delete()
    .eq("id", friendshipId);

  if (error) {
    console.error("Error removing friendship:", error);
    return false;
  }
  return true;
}

// Check if friendship exists (any status)
export async function checkFriendshipStatus(friendId: string) {
  const { userId } = await auth();
  if (!userId) return null;

  const { data, error } = await supabase
    .from("friendships")
    .select("*")
    .or(
      `and(userId.eq.${userId},friendId.eq.${friendId}),and(userId.eq.${friendId},friendId.eq.${userId})`
    )
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error checking friendship status:", error);
  }

  return data;
}
