"use client";

import { useState } from "react";
import { userSignUp, getUserInfo, updateUserInfo, getCurrentUser } from "@/lib/supabase";

export default function TestUsersPage() {
  // Sign up state
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Get user info state
  const [userId, setUserId] = useState("");
  const [userInfoLoading, setUserInfoLoading] = useState(false);
  const [userInfoResult, setUserInfoResult] = useState<string | null>(null);
  const [userInfoError, setUserInfoError] = useState<string | null>(null);

// update user state 
  // Update user info state
  const [updateUserId, setUpdateUserId] = useState("");
  const [updateField, setUpdateField] = useState<"name" | "email">("name");
  const [updateValue, setUpdateValue] = useState("");
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateResult, setUpdateResult] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  // Get current user state
  const [currentUserLoading, setCurrentUserLoading] = useState(false);
  const [currentUserResult, setCurrentUserResult] = useState<string | null>(null);
  const [currentUserError, setCurrentUserError] = useState<string | null>(null);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const data = await userSignUp(name, email, password);
      setResult(
        `Success! User created:\n` +
        `Auth User ID: ${data.user.id}\n` +
        `Email: ${data.user.email}\n` +
        `Profile Name: ${data.profile.name}\n` +
        `Profile Email: ${data.profile.email}`
      );
      // Set the user ID for easy testing
      setUserId(data.user.id);
      // Clear form
      setName("");
      setEmail("");
      setPassword("");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (err && typeof err === 'object' && 'message' in err) {
        setError(String(err.message));
      } else {
        setError(`Unknown error: ${JSON.stringify(err, null, 2)}`);
      }
      console.error('Signup error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleGetUserInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setUserInfoLoading(true);
    setUserInfoError(null);
    setUserInfoResult(null);

    try {
      const data = await getUserInfo(userId);
      setUserInfoResult(
        `User Info:\n` +
        `ID: ${data.id}\n` +
        `Name: ${data.name}\n` +
        `Email: ${data.email}\n` +
        `Created At: ${data.created_at}`
      );
    } catch (err) {
      if (err instanceof Error) {
        setUserInfoError(err.message);
      } else if (err && typeof err === 'object' && 'message' in err) {
        setUserInfoError(String(err.message));
      } else {
        setUserInfoError(`Unknown error: ${JSON.stringify(err, null, 2)}`);
      }
      console.error('Get user info error:', err);
    } finally {
      setUserInfoLoading(false);
    }
  };

  const handleUpdateUserInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateLoading(true);
    setUpdateError(null);
    setUpdateResult(null);

    try {
      const data = await updateUserInfo(updateUserId, updateField, updateValue);
      setUpdateResult(
        `Success! User updated:\n` +
        `ID: ${data.id}\n` +
        `Name: ${data.name}\n` +
        `Email: ${data.email}\n` +
        `Updated At: ${new Date().toISOString()}`
      );
      // Clear form
      setUpdateValue("");
    } catch (err) {
      if (err instanceof Error) {
        setUpdateError(err.message);
      } else if (err && typeof err === 'object' && 'message' in err) {
        setUpdateError(String(err.message));
      } else {
        setUpdateError(`Unknown error: ${JSON.stringify(err, null, 2)}`);
      }
      console.error('Update user info error:', err);
    } finally {
      setUpdateLoading(false);
    }
  };

  const handleGetCurrentUser = async () => {
    setCurrentUserLoading(true);
    setCurrentUserError(null);
    setCurrentUserResult(null);

    try {
      const user = await getCurrentUser();
      if (!user) {
        setCurrentUserResult("Not logged in - no current user");
      } else {
        setCurrentUserResult(
          `Current User:\n` +
          `ID: ${user.id}\n` +
          `Email: ${user.email}\n` +
          `Display Name: ${user.user_metadata?.name || user.user_metadata?.display_name || 'Not set'}\n` +
          `Created At: ${user.created_at}\n` +
          `Last Sign In: ${user.last_sign_in_at || 'Never'}`
        );
      }
    } catch (err) {
      if (err instanceof Error) {
        setCurrentUserError(err.message);
      } else if (err && typeof err === 'object' && 'message' in err) {
        setCurrentUserError(String(err.message));
      } else {
        setCurrentUserError(`Unknown error: ${JSON.stringify(err, null, 2)}`);
      }
      console.error('Get current user error:', err);
    } finally {
      setCurrentUserLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#2d2d2a] p-8">
      <div className="max-w-2xl mx-auto space-y-8">
        <h1 className="font-serif text-3xl font-light italic mb-8">Test Users</h1>

        {/* Sign Up Section */}
        <div className="border-[6px] border-[#f0ede6] bg-[#fdfcfa] p-8 shadow-sm">
          <h2 className="font-serif text-xl font-light italic mb-6">Sign Up</h2>
          <form onSubmit={handleSignUp} className="space-y-6">
            <div>
              <label className="block text-sm font-light mb-2 text-[#6b6b66]">Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="w-full px-4 py-2 border-[2px] border-[#f0ede6] bg-[#fdfcfa] text-[#2d2d2a] focus:outline-none focus:border-[#2d2d2a]"
              />
            </div>

            <div>
              <label className="block text-sm font-light mb-2 text-[#6b6b66]">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full px-4 py-2 border-[2px] border-[#f0ede6] bg-[#fdfcfa] text-[#2d2d2a] focus:outline-none focus:border-[#2d2d2a]"
              />
            </div>

            <div>
              <label className="block text-sm font-light mb-2 text-[#6b6b66]">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                className="w-full px-4 py-2 border-[2px] border-[#f0ede6] bg-[#fdfcfa] text-[#2d2d2a] focus:outline-none focus:border-[#2d2d2a]"
              />
              <p className="text-xs font-light italic text-[#6b6b66] mt-1">Minimum 6 characters</p>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full border border-[#2d2d2a] border-opacity-30 bg-[#fdfcfa] px-4 py-2 text-sm font-light uppercase tracking-wider text-[#2d2d2a] transition-all hover:bg-[#2d2d2a] hover:text-[#fdfcfa] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>

          {result && (
            <div className="mt-6 p-4 border-[2px] border-[#f0ede6] bg-[#fdfcfa]">
              <p className="text-sm font-light text-[#2d2d2a] mb-2">✅ Success!</p>
              <pre className="whitespace-pre-wrap text-xs font-light text-[#6b6b66]">{result}</pre>
            </div>
          )}

          {error && (
            <div className="mt-6 p-4 border-[2px] border-red-300 bg-red-50">
              <p className="text-sm font-light text-red-700">❌ Error: {error}</p>
            </div>
          )}
        </div>

        {/* Get User Info Section */}
        <div className="border-[6px] border-[#f0ede6] bg-[#fdfcfa] p-8 shadow-sm">
          <h2 className="font-serif text-xl font-light italic mb-6">Get User Info</h2>
          <form onSubmit={handleGetUserInfo} className="space-y-6">
            <div>
              <label className="block text-sm font-light mb-2 text-[#6b6b66]">User ID</label>
              <input
                type="text"
                value={userId}
                onChange={(e) => setUserId(e.target.value)}
                required
                placeholder="Paste user ID from sign up above"
                className="w-full px-4 py-2 border-[2px] border-[#f0ede6] bg-[#fdfcfa] text-[#2d2d2a] focus:outline-none focus:border-[#2d2d2a]"
              />
            </div>

            <button
              type="submit"
              disabled={userInfoLoading}
              className="w-full border border-[#2d2d2a] border-opacity-30 bg-[#fdfcfa] px-4 py-2 text-sm font-light uppercase tracking-wider text-[#2d2d2a] transition-all hover:bg-[#2d2d2a] hover:text-[#fdfcfa] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {userInfoLoading ? "Loading..." : "Get User Info"}
            </button>
          </form>

          {userInfoResult && (
            <div className="mt-6 p-4 border-[2px] border-[#f0ede6] bg-[#fdfcfa]">
              <p className="text-sm font-light text-[#2d2d2a] mb-2">✅ Success!</p>
              <pre className="whitespace-pre-wrap text-xs font-light text-[#6b6b66]">{userInfoResult}</pre>
            </div>
          )}

          {userInfoError && (
            <div className="mt-6 p-4 border-[2px] border-red-300 bg-red-50">
              <p className="text-sm font-light text-red-700">❌ Error: {userInfoError}</p>
            </div>
          )}
        </div>

        {/* Get Current User Section */}
        <div className="border-[6px] border-[#f0ede6] bg-[#fdfcfa] p-8 shadow-sm">
          <h2 className="font-serif text-xl font-light italic mb-6">Get Current User</h2>
          <div className="space-y-6">
            <p className="text-sm font-light text-[#6b6b66]">
              Get the currently authenticated user. No ID needed - uses your current session.
            </p>

            <button
              type="button"
              onClick={handleGetCurrentUser}
              disabled={currentUserLoading}
              className="w-full border border-[#2d2d2a] border-opacity-30 bg-[#fdfcfa] px-4 py-2 text-sm font-light uppercase tracking-wider text-[#2d2d2a] transition-all hover:bg-[#2d2d2a] hover:text-[#fdfcfa] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {currentUserLoading ? "Loading..." : "Get Current User"}
            </button>
          </div>

          {currentUserResult && (
            <div className="mt-6 p-4 border-[2px] border-[#f0ede6] bg-[#fdfcfa]">
              <p className="text-sm font-light text-[#2d2d2a] mb-2">✅ Success!</p>
              <pre className="whitespace-pre-wrap text-xs font-light text-[#6b6b66]">{currentUserResult}</pre>
            </div>
          )}

          {currentUserError && (
            <div className="mt-6 p-4 border-[2px] border-red-300 bg-red-50">
              <p className="text-sm font-light text-red-700">❌ Error: {currentUserError}</p>
            </div>
          )}
        </div>

        {/* Update User Info Section */}
        <div className="border-[6px] border-[#f0ede6] bg-[#fdfcfa] p-8 shadow-sm">
          <h2 className="font-serif text-xl font-light italic mb-6">Update User Info</h2>
          <form onSubmit={handleUpdateUserInfo} className="space-y-6">
            <div>
              <label className="block text-sm font-light mb-2 text-[#6b6b66]">User ID</label>
              <input
                type="text"
                value={updateUserId}
                onChange={(e) => setUpdateUserId(e.target.value)}
                required
                placeholder="Paste user ID"
                className="w-full px-4 py-2 border-[2px] border-[#f0ede6] bg-[#fdfcfa] text-[#2d2d2a] focus:outline-none focus:border-[#2d2d2a]"
              />
            </div>

            <div>
              <label className="block text-sm font-light mb-2 text-[#6b6b66]">Field to Update</label>
              <select
                value={updateField}
                onChange={(e) => setUpdateField(e.target.value as "name" | "email")}
                className="w-full px-4 py-2 border-[2px] border-[#f0ede6] bg-[#fdfcfa] text-[#2d2d2a] focus:outline-none focus:border-[#2d2d2a]"
              >
                <option value="name">Name</option>
                <option value="email">Email</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-light mb-2 text-[#6b6b66]">New Value</label>
              <input
                type={updateField === "email" ? "email" : "text"}
                value={updateValue}
                onChange={(e) => setUpdateValue(e.target.value)}
                required
                placeholder={`Enter new ${updateField}`}
                className="w-full px-4 py-2 border-[2px] border-[#f0ede6] bg-[#fdfcfa] text-[#2d2d2a] focus:outline-none focus:border-[#2d2d2a]"
              />
            </div>

            <button
              type="submit"
              disabled={updateLoading}
              className="w-full border border-[#2d2d2a] border-opacity-30 bg-[#fdfcfa] px-4 py-2 text-sm font-light uppercase tracking-wider text-[#2d2d2a] transition-all hover:bg-[#2d2d2a] hover:text-[#fdfcfa] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {updateLoading ? "Updating..." : "Update User Info"}
            </button>
          </form>

          {updateResult && (
            <div className="mt-6 p-4 border-[2px] border-[#f0ede6] bg-[#fdfcfa]">
              <p className="text-sm font-light text-[#2d2d2a] mb-2">✅ Success!</p>
              <pre className="whitespace-pre-wrap text-xs font-light text-[#6b6b66]">{updateResult}</pre>
            </div>
          )}

          {updateError && (
            <div className="mt-6 p-4 border-[2px] border-red-300 bg-red-50">
              <p className="text-sm font-light text-red-700">❌ Error: {updateError}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
