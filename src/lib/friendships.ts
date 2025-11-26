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

// Get all accepted friends
export async function getFriendsList() {
  const user = await currentUser();
  if (!user?.username) return [];

  // Fetch all friendships where status is 'ACCEPTED' and I am either the user or the friend
  const { data, error } = await supabase
    .from("friendships")
    .select(
      `
      id,
      username,
      friend_username,
      status,
      sender:users!friendships_username_fkey(name, username),
      receiver:users!friendships_friend_username_fkey(name, username)
    `
    )
    .eq("status", "ACCEPTED")
    .or(`username.eq.${user.username},friend_username.eq.${user.username}`);

  if (error) {
    console.error("Error fetching friends:", error);
    return [];
  }

  // Normalize the list so it's just a list of friend objects
  return data.map((f) => {
    const isMeSender = f.username === user.username;
    // @ts-ignore
    const friendData = isMeSender ? f.receiver : f.sender;

    return {
      id: f.id,
      // @ts-ignore
      name: friendData?.name || "Unknown",
      // @ts-ignore
      username: friendData?.username || "Unknown",
      totalHours: 0, // Placeholder
      currentStreak: 0, // Placeholder
    };
  });
}
