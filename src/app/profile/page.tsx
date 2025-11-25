"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import ImageModal from "@/components/ImageModal";
import ImageCarousel from "@/components/ImageCarousel";
import { FriendsList } from "@/components/FriendsList";
import { SignOutButton, useUser } from "@clerk/nextjs";
import FindFriendModal from "@/components/FindFriendModal";
import {
  getFriendRequests,
  acceptFriendRequest,
  removeFriendship,
} from "@/lib/friendships";

interface Session {
  id: number;
  title: string;
  description: string;
  duration: string;
  durationSeconds: number;
  location: string | null;
  photos: string[];
  date: string;
  user: string;
}

interface FriendRequest {
  id: string;
  created_at: string;
  sender: {
    id: string;
    name: string;
    email: string;
  } | null;
}

export default function ProfilePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [friendRequests, setFriendRequests] = useState<FriendRequest[]>([]);
  const { user } = useUser();

  useEffect(() => {
    const savedSessions = JSON.parse(localStorage.getItem("sessions") || "[]");
    setSessions(savedSessions);
  }, []);

  useEffect(() => {
    if (user) {
      loadFriendRequests();
    }
  }, [user]);

  const loadFriendRequests = async () => {
    try {
      const requests = await getFriendRequests();
      // Cast to unknown first if types don't match exactly due to join
      setFriendRequests(requests as unknown as FriendRequest[]);
    } catch (error) {
      console.error("Failed to load friend requests", error);
    }
  };

  const handleAccept = async (id: string) => {
    await acceptFriendRequest(id);
    loadFriendRequests();
  };

  const handleDecline = async (id: string) => {
    await removeFriendship(id);
    loadFriendRequests();
  };

  const totalSeconds = sessions.reduce(
    (acc, session) => acc + session.durationSeconds,
    0
  );
  const totalHours = Math.floor(totalSeconds / 3600);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    const diffDays = Math.floor(diffHours / 24);
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const handleClearAll = () => {
    if (
      confirm(
        "Are you sure you want to delete all sessions? This cannot be undone."
      )
    ) {
      localStorage.removeItem("sessions");
      setSessions([]);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#2d2d2a]">
      <Nav />

      {selectedImage && (
        <ImageModal
          src={selectedImage}
          alt="Session photo"
          onClose={() => setSelectedImage(null)}
        />
      )}

      <main className="mx-auto max-w-4xl px-6 py-12">
        <div className="mb-12 border-8 border-[#f0ede6] bg-[#fdfcfa] p-8 shadow-lg">
          <div className="flex flex-col md:flex-row items-start justify-between gap-6">
            <div className="flex-1">
              <h1 className="mb-2 font-serif text-4xl font-light italic tracking-tight text-[#2d2d2a]">
                {user?.firstName || "Loading..."} {user?.lastName}
              </h1>

              <div className="mt-6 flex flex-wrap items-center gap-6">
                <FriendsList />
                <div className="h-8 w-px bg-[#2d2d2a]/10 hidden md:block"></div>
                <div className="flex flex-col gap-1">
                  <span className="text-xs font-light uppercase tracking-wider text-[#6b6b66]">
                    Add Friend
                  </span>
                  <FindFriendModal />
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start md:items-end gap-3">
              <div className="cursor-pointer px-4 py-2 bg-[#2d2d2a] text-[#fdfcfa] text-sm font-light uppercase tracking-wider hover:bg-opacity-90 transition-all">
                <SignOutButton />
              </div>
              {sessions.length > 0 && (
                <button
                  onClick={handleClearAll}
                  className="text-xs font-light uppercase tracking-wider text-red-800 hover:underline"
                >
                  Clear local data
                </button>
              )}
            </div>
          </div>

          {/* Friend Requests Section */}
          <div className="mt-10 border-t border-[#f0ede6] pt-8">
            <h3 className="mb-6 font-serif text-2xl italic text-[#2d2d2a]">
              Friend Requests
            </h3>
            {friendRequests.length === 0 ? (
              <div className="rounded-lg border border-dashed border-[#2d2d2a]/20 p-6 text-center">
                <p className="text-sm font-light text-[#6b6b66] italic">
                  No pending requests.
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {friendRequests.map((req) => (
                  <div
                    key={req.id}
                    className="flex items-center justify-between border border-[#f0ede6] bg-white p-4 shadow-sm transition-all hover:shadow-md"
                  >
                    <div>
                      <p className="font-medium text-[#2d2d2a] font-serif italic text-lg">
                        {req.sender?.name || "Unknown User"}
                      </p>
                      <p className="text-xs text-[#6b6b66] font-light">
                        {new Date(req.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleAccept(req.id)}
                        className="px-3 py-1 text-xs bg-[#2d2d2a] text-[#fdfcfa] uppercase tracking-wider hover:bg-opacity-80 transition-all"
                      >
                        Accept
                      </button>
                      <button
                        onClick={() => handleDecline(req.id)}
                        className="px-3 py-1 text-xs border border-[#2d2d2a] text-[#2d2d2a] uppercase tracking-wider hover:bg-gray-50 transition-all"
                      >
                        Decline
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-12 grid grid-cols-3 gap-6">
          <div className="border-[6px] border-[#f0ede6] bg-[#fdfcfa] p-6 text-center shadow-sm transition-all hover:shadow-md">
            <div className="mb-2 text-4xl font-light text-[#2d2d2a]">
              {totalHours}h
            </div>
            <div className="text-sm font-light italic text-[#6b6b66]">
              Total time
            </div>
          </div>
          <div className="border-[6px] border-[#f0ede6] bg-[#fdfcfa] p-6 text-center shadow-sm transition-all hover:shadow-md">
            <div className="mb-2 text-4xl font-light text-[#2d2d2a]">
              {sessions.length}
            </div>
            <div className="text-sm font-light italic text-[#6b6b66]">
              Sessions
            </div>
          </div>
          <div className="border-[6px] border-[#f0ede6] bg-[#fdfcfa] p-6 text-center shadow-sm transition-all hover:shadow-md">
            <div className="mb-2 text-4xl font-light text-[#2d2d2a]">7</div>
            <div className="text-sm font-light italic text-[#6b6b66]">
              Day streak
            </div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="space-y-6">
          {sessions.length === 0 ? (
            <div className="border-8 border-[#f0ede6] bg-[#fdfcfa] p-12 text-center shadow-sm">
              <p className="font-light italic text-[#6b6b66]">
                No sessions yet. Start your first one!
              </p>
            </div>
          ) : (
            sessions.map((session) => (
              <div
                key={session.id}
                className="overflow-hidden border-[6px] border-[#f0ede6] bg-[#fdfcfa] shadow-sm"
              >
                {/* Post Header */}
                <div className="border-b border-[#2d2d2a] border-opacity-5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-light text-lg text-[#2d2d2a]">
                        {session.user}
                      </h3>
                      <p className="text-xs font-light italic text-[#6b6b66]">
                        {formatDate(session.date)}
                      </p>
                    </div>
                    <div className="font-light text-2xl text-[#2d2d2a]">
                      {session.duration}
                    </div>
                  </div>
                </div>

                {/* Photos */}
                {session.photos && session.photos.length > 0 && (
                  <ImageCarousel
                    images={session.photos}
                    onImageClick={setSelectedImage}
                  />
                )}

                {/* Post Content */}
                <div className="p-4">
                  <h4 className="mb-2 font-light text-xl text-[#2d2d2a]">
                    {session.title}
                  </h4>
                  <p className="mb-3 font-light italic text-[#6b6b66]">
                    {session.description}
                  </p>
                  {session.location && (
                    <p className="text-sm font-light text-[#6b6b66]">
                      📍 {session.location}
                    </p>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
