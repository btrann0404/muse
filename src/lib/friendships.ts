"use server";

import { supabase } from "./supabase";
import { Database } from "@/types/database";
import { auth, currentUser } from "@clerk/nextjs/server";

export type Friendship = Database["public"]["Tables"]["friendships"]["Row"];

// Send a friend request (Username based)
export async function sendFriendRequest(targetUsername: string) {
  const user = await currentUser();
  if (!user?.username) throw new Error("Unauthorized or no username set");

  const { data, error } = await supabase
    .from("friendships")
    .insert({
      username: user.username, // Me
      friend_username: targetUsername, // Them
      status: "PENDING",
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
  const user = await currentUser();
  if (!user?.username) return [];

  const { data, error } = await supabase
    .from("friendships")
    .select(
      `
      *,
      sender:users!friendships_username_fkey (
        id,
        name,
        username,
        email
      )
    `
    )
    .eq("friend_username", user.username) // I am the friend (recipient)
    .eq("status", "PENDING");

  if (error) {
    console.error("Error fetching friend requests:", error);
    return [];
  }

  return data || [];
}

// Accept a friend request
export async function acceptFriendRequest(friendshipId: string) {
  const { userId } = await auth(); // We still verify auth
  if (!userId) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("friendships")
    .update({ status: "ACCEPTED" })
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
export async function checkFriendshipStatus(targetUsername: string) {
  const user = await currentUser();
  if (!user?.username) return null;

  const { data, error } = await supabase
    .from("friendships")
    .select("*")
    .or(
      `and(username.eq.${user.username},friend_username.eq.${targetUsername}),and(username.eq.${targetUsername},friend_username.eq.${user.username})`
    )
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error checking friendship status:", error);
  }

  return data;
}
