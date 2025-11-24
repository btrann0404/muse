"use client";

import { useState } from "react";
import { useUser, SignIn, SignOutButton } from "@clerk/nextjs";
import { getUserInfo, updateUserInfo, getCurrentUser } from "@/lib/users";

export default function TestUsersPage() {
  // Clerk Hook for Client-Side User
  const { user, isLoaded, isSignedIn } = useUser();

  // Get user info state
  const [userId, setUserId] = useState("");
  const [userInfoLoading, setUserInfoLoading] = useState(false);
  const [userInfoResult, setUserInfoResult] = useState<string | null>(null);
  const [userInfoError, setUserInfoError] = useState<string | null>(null);

  // Update user info state
  const [updateValue, setUpdateValue] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateResult, setUpdateResult] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // DB Sync Check State
  const [dbCheckLoading, setDbCheckLoading] = useState(false);
  const [dbCheckResult, setDbCheckResult] = useState<string | null>(null);

  // 1. Check if Clerk User exists in Supabase
  const handleCheckDbSync = async () => {
    if (!user) return;
    setDbCheckLoading(true);
    setDbCheckResult(null);
    try {
      // We use the server action to check Supabase
      const dbUser = await getUserInfo(user.id);

      if (dbUser) {
        setDbCheckResult(
          `✅ Synced!\nSupabase ID: ${dbUser.id}\nName: ${dbUser.name}\nEmail: ${dbUser.email}`
        );
      } else {
        setDbCheckResult(
          `❌ Not Synced Yet.\nUser ID ${user.id} not found in Supabase.\n\nTip: Webhooks might be delayed or failed. Check Clerk Dashboard > Webhooks.`
        );
      }
    } catch (err) {
      setDbCheckResult(`❌ Error Checking Sync:\n${err}`);
    } finally {
      setDbCheckLoading(false);
    }
  };

  // 2. Get Any User Info
  const handleGetUserInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserInfoLoading(true);
    setUserInfoError(null);
    setUserInfoResult(null);

    try {
      const data = await getUserInfo(userId);
      if (data) {
        setUserInfoResult(
          `User Info:\nID: ${data.id}\nName: ${data.name}\nEmail: ${data.email}`
        );
      } else {
        setUserInfoResult("User not found in database.");
      }
    } catch (err) {
      setUserInfoError(err instanceof Error ? err.message : String(err));
    } finally {
      setUserInfoLoading(false);
    }
  };

  // 3. Update User Info
  const handleUpdateName = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setUpdateLoading(true);
    setUpdateError(null);
    setUpdateResult(null);

    try {
      // Call Server Action
      const data = await updateUserInfo(user.id, "name", updateValue);
      setUpdateResult(`Success! Name updated to: ${data.name}`);
      setUpdateValue("");
      // Refresh Clerk user to show new name if we were syncing back (optional)
      user.reload();
    } catch (err) {
      setUpdateError(err instanceof Error ? err.message : String(err));
    } finally {
      setUpdateLoading(false);
    }
  };

  if (!isLoaded) return <div className="p-8">Loading Clerk...</div>;

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#2d2d2a] p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="font-serif text-3xl font-light italic mb-8">
          Migration Test Page
        </h1>

        {/* AUTH SECTION */}
        <div className="border-[6px] border-[#f0ede6] bg-[#fdfcfa] p-8 shadow-sm">
          <h2 className="font-serif text-xl font-light italic mb-6">
            1. Authentication
          </h2>

          {!isSignedIn ? (
            <div>
              <p className="mb-4 text-sm text-[#6b6b66]">
                You are signed out. Sign in with Clerk to test.
              </p>
              <SignIn />
            </div>
          ) : (
            <div className="space-y-4">
              <div className="p-4 bg-green-50 border border-green-200 text-green-800 rounded">
                <p className="font-bold">Signed In as:</p>
                <p>Name: {user.fullName}</p>
                <p>Email: {user.primaryEmailAddress?.emailAddress}</p>
                <p className="text-xs mt-2 font-mono">Clerk ID: {user.id}</p>
              </div>

              <SignOutButton>
                <button className="px-4 py-2 bg-[#2d2d2a] text-white text-sm uppercase tracking-wider hover:opacity-90">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          )}
        </div>

        {/* DATABASE SYNC CHECK */}
        {isSignedIn && (
          <div className="border-[6px] border-[#f0ede6] bg-[#fdfcfa] p-8 shadow-sm">
            <h2 className="font-serif text-xl font-light italic mb-6">
              2. Webhook/DB Sync Check
            </h2>
            <p className="text-sm text-[#6b6b66] mb-4">
              Check if your Clerk user was successfully copied to Supabase via
              the Webhook.
            </p>

            <button
              onClick={handleCheckDbSync}
              disabled={dbCheckLoading}
              className="w-full border border-[#2d2d2a] border-opacity-30 bg-[#fdfcfa] px-4 py-2 text-sm font-light uppercase tracking-wider text-[#2d2d2a] hover:bg-[#2d2d2a] hover:text-[#fdfcfa]"
            >
              {dbCheckLoading ? "Checking..." : "Check Database Sync"}
            </button>

            {dbCheckResult && (
              <pre className="mt-4 p-4 bg-gray-100 text-xs overflow-auto whitespace-pre-wrap">
                {dbCheckResult}
              </pre>
            )}
          </div>
        )}

        {/* MANUAL DB LOOKUP */}
        <div className="border-[6px] border-[#f0ede6] bg-[#fdfcfa] p-8 shadow-sm">
          <h2 className="font-serif text-xl font-light italic mb-6">
            3. Manual DB Lookup
          </h2>
          <form onSubmit={handleGetUserInfo} className="space-y-4">
            <input
              type="text"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
              placeholder="Paste any User ID"
              className="w-full px-4 py-2 border-[2px] border-[#f0ede6] bg-[#fdfcfa]"
            />
            <button
              type="submit"
              disabled={userInfoLoading}
              className="w-full border border-[#2d2d2a] border-opacity-30 bg-[#fdfcfa] px-4 py-2 text-sm font-light uppercase tracking-wider text-[#2d2d2a] hover:bg-[#2d2d2a] hover:text-[#fdfcfa]"
            >
              {userInfoLoading ? "Searching..." : "Search User"}
            </button>
          </form>
          {userInfoResult && (
            <pre className="mt-4 p-4 bg-gray-100 text-xs overflow-auto whitespace-pre-wrap">
              {userInfoResult}
            </pre>
          )}
          {userInfoError && (
            <p className="mt-4 text-sm text-red-600">Error: {userInfoError}</p>
          )}
        </div>

        {/* UPDATE TEST */}
        {isSignedIn && (
          <div className="border-[6px] border-[#f0ede6] bg-[#fdfcfa] p-8 shadow-sm">
            <h2 className="font-serif text-xl font-light italic mb-6">
              4. Update Supabase Profile
            </h2>
            <form onSubmit={handleUpdateName} className="space-y-4">
              <input
                type="text"
                value={updateValue}
                onChange={(e) => setUpdateValue(e.target.value)}
                placeholder="New Name"
                className="w-full px-4 py-2 border-[2px] border-[#f0ede6] bg-[#fdfcfa]"
              />
              <button
                type="submit"
                disabled={updateLoading}
                className="w-full border border-[#2d2d2a] border-opacity-30 bg-[#fdfcfa] px-4 py-2 text-sm font-light uppercase tracking-wider text-[#2d2d2a] hover:bg-[#2d2d2a] hover:text-[#fdfcfa]"
              >
                {updateLoading ? "Updating..." : "Update Name"}
              </button>
            </form>
            {updateResult && (
              <p className="mt-4 text-sm text-green-600">{updateResult}</p>
            )}
            {updateError && (
              <p className="mt-4 text-sm text-red-600">Error: {updateError}</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
