"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import ImageModal from "@/components/ImageModal";
import ImageCarousel from "@/components/ImageCarousel";
import { FriendsList } from "@/components/FriendsList";

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

export default function ProfilePage() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const savedSessions = JSON.parse(localStorage.getItem("sessions") || "[]");
    setSessions(savedSessions);
  }, []);

  const totalSeconds = sessions.reduce((acc, session) => acc + session.durationSeconds, 0);
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
    if (confirm("Are you sure you want to delete all sessions? This cannot be undone.")) {
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
        <div className="mb-12 border-[8px] border-[#f0ede6] bg-[#fdfcfa] p-8 shadow-lg">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="mb-2 font-serif text-4xl font-light italic tracking-tight text-[#2d2d2a]">Brandon</h1>
              <p className="font-light italic text-[#6b6b66]">Student</p>
            </div>
            <FriendsList/>
            {sessions.length > 0 && (
              <button
                onClick={handleClearAll}
                className="border border-[#2d2d2a] border-opacity-30 bg-[#fdfcfa] px-4 py-2 text-sm font-light uppercase tracking-wider text-[#2d2d2a] transition-all hover:bg-[#2d2d2a] hover:text-[#fdfcfa]"
              >
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Stats */}
        <div className="mb-12 grid grid-cols-3 gap-6">
          <div className="border-[6px] border-[#f0ede6] bg-[#fdfcfa] p-6 text-center shadow-sm transition-all hover:shadow-md">
            <div className="mb-2 text-4xl font-light text-[#2d2d2a]">{totalHours}h</div>
            <div className="text-sm font-light italic text-[#6b6b66]">Total time</div>
          </div>
          <div className="border-[6px] border-[#f0ede6] bg-[#fdfcfa] p-6 text-center shadow-sm transition-all hover:shadow-md">
            <div className="mb-2 text-4xl font-light text-[#2d2d2a]">{sessions.length}</div>
            <div className="text-sm font-light italic text-[#6b6b66]">Sessions</div>
          </div>
          <div className="border-[6px] border-[#f0ede6] bg-[#fdfcfa] p-6 text-center shadow-sm transition-all hover:shadow-md">
            <div className="mb-2 text-4xl font-light text-[#2d2d2a]">7</div>
            <div className="text-sm font-light italic text-[#6b6b66]">Day streak</div>
          </div>
        </div>

        {/* Recent Sessions */}
        <div className="space-y-6">
          {sessions.length === 0 ? (
            <div className="border-[8px] border-[#f0ede6] bg-[#fdfcfa] p-12 text-center shadow-sm">
              <p className="font-light italic text-[#6b6b66]">No sessions yet. Start your first one!</p>
            </div>
          ) : (
            sessions.map((session) => (
              <div key={session.id} className="overflow-hidden border-[6px] border-[#f0ede6] bg-[#fdfcfa] shadow-sm">
                {/* Post Header */}
                <div className="border-b border-[#2d2d2a] border-opacity-5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-light text-lg text-[#2d2d2a]">{session.user}</h3>
                      <p className="text-xs font-light italic text-[#6b6b66]">{formatDate(session.date)}</p>
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
                  <h4 className="mb-2 font-light text-xl text-[#2d2d2a]">{session.title}</h4>
                  <p className="mb-3 font-light italic text-[#6b6b66]">{session.description}</p>
                  {session.location && (
                    <p className="text-sm font-light text-[#6b6b66]">📍 {session.location}</p>
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
