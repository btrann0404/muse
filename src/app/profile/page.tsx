import { getFriendsList } from "@/lib/friendships";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const friends = await getFriendsList();

  return <ProfileClient initialFriends={friends} />;
}
