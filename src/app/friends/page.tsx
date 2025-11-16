"use client";

import { useEffect, useState } from "react";
import Nav from "@/components/Nav";
import ImageModal from "@/components/ImageModal";
import ImageCarousel from "@/components/ImageCarousel";

interface Activity {
  id: number;
  user: string;
  title: string;
  description: string;
  duration: string;
  location: string | null;
  photos: string[];
  date: string;
}

// Mock friends' activities (would come from API in real app)
const mockFriendsActivities: Activity[] = [
  {
    id: 1001,
    user: "Sarah",
    title: "Organic Chemistry",
    description: "Chapter 8: Alkenes and Alkynes. Working through reaction mechanisms.",
    duration: "2h 45m",
    location: "Central Library",
    photos: [
      "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=600&h=600&fit=crop", // Study desk with books
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=600&fit=crop", // Matcha tea
    ],
    date: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 1002,
    user: "Alex",
    title: "Data Structures",
    description: "Implementing binary trees in Python. Finally understanding the recursion!",
    duration: "1h 30m",
    location: "Starbucks Downtown",
    photos: [
      "https://images.unsplash.com/photo-1524178232363-1fb2b075b655?w=600&h=600&fit=crop", // Laptop on desk
      "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7?w=600&h=600&fit=crop", // Coffee cup
    ],
    date: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 1003,
    user: "Emily",
    title: "Quantum Physics",
    description: "Wave functions and probability amplitudes. Mind-bending stuff.",
    duration: "3h 15m",
    location: "Home",
    photos: [
      "https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=600&h=600&fit=crop", // Cozy study space
      "https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=600&h=600&fit=crop", // Tea cup
    ],
    date: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
  },
];

export default function FeedPage() {
  const [allActivities, setAllActivities] = useState<Activity[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    // Load user's own sessions
    const userSessions = JSON.parse(localStorage.getItem("sessions") || "[]");
    
    // Combine with mock friends' activities and sort by date
    const combined = [...mockFriendsActivities, ...userSessions].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
    
    setAllActivities(combined);
  }, []);

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

      <main className="mx-auto max-w-xl px-4 py-8">
        <h1 className="mb-8 font-serif text-3xl font-light italic tracking-tight text-[#2d2d2a]">Friends</h1>

        <div className="space-y-6">
          {allActivities.length === 0 ? (
            <div className="border-[8px] border-[#f0ede6] bg-[#fdfcfa] p-8 text-center shadow-sm">
              <p className="font-light italic text-[#6b6b66]">No activities yet</p>
            </div>
          ) : (
            allActivities.map((activity) => (
              <div key={activity.id} className="overflow-hidden border-[6px] border-[#f0ede6] bg-[#fdfcfa] shadow-sm transition-all hover:shadow-md">
                {/* Post Header */}
                <div className="border-b border-[#2d2d2a] border-opacity-5 p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-light text-base text-[#2d2d2a]">{activity.user}</h3>
                      <p className="text-xs font-light italic text-[#6b6b66]">{formatDate(activity.date)}</p>
                    </div>
                    <div className="font-light text-xl text-[#2d2d2a]">
                      {activity.duration}
                    </div>
                  </div>
                </div>

                {/* Photos */}
                {activity.photos && activity.photos.length > 0 && (
                  <ImageCarousel
                    images={activity.photos}
                    onImageClick={setSelectedImage}
                  />
                )}

                {/* Post Content */}
                <div className="p-4">
                  <h4 className="mb-1.5 font-light text-lg text-[#2d2d2a]">{activity.title}</h4>
                  <p className="mb-2 font-light text-sm italic text-[#6b6b66]">{activity.description}</p>
                  {activity.location && (
                    <p className="text-xs font-light text-[#6b6b66]">📍 {activity.location}</p>
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
