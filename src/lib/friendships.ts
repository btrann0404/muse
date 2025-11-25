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
      userid: userId, // FIX: use lowercase 'userid'
      friendid: friendId, // FIX: use lowercase 'friendid'
      status: "PENDING", // FIX: use uppercase 'PENDING'
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
      userid,
      friendid,
      status,
      created_at,
      sender:users!friendships_userid_fkey (
        id,
        name,
        username,
        email
      )
    `
    )
    .eq("friendid", userId)
    .eq("status", "PENDING");

  if (error) {
    console.error("Error fetching friend requests:", error);
    return [];
  }

  console.log("Friend RQ Found:", { data });
  return data || [];
}

// Accept a friend request
export async function acceptFriendRequest(friendshipId: string) {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const { data, error } = await supabase
    .from("friendships")
    .update({ status: "ACCEPTED" }) // FIX: use uppercase 'ACCEPTED'
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
    // FIX: use lowercase 'userid' and 'friendid' in the query string
    .or(
      `and(userid.eq.${userId},friendid.eq.${friendId}),and(userid.eq.${friendId},friendid.eq.${userId})`
    )
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Error checking friendship status:", error);
  }

  return data;
}
