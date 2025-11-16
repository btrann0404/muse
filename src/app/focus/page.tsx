"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Nav from "@/components/Nav";

export default function TimerPage() {
  const router = useRouter();
  const [isRunning, setIsRunning] = useState(false);
  const [seconds, setSeconds] = useState(0);
  const [showSaveForm, setShowSaveForm] = useState(false);
  
  // Form fields (filled after session ends)
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [workDescription, setWorkDescription] = useState("");
  const [photos, setPhotos] = useState<File[]>([]);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isRunning) {
      interval = setInterval(() => {
        setSeconds((s) => s + 1);
      }, 1000);
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isRunning]);

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handleStop = () => {
    setIsRunning(false);
    setShowSaveForm(true);
  };

  const handleSave = async () => {
    // Convert photos to base64 for local storage
    const photoUrls: string[] = [];
    for (const photo of photos) {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(photo);
      });
      photoUrls.push(base64);
    }

    // Save to localStorage (in real app, would save to database)
    const session = {
      id: Date.now(),
      title,
      description: workDescription,
      duration: formatTime(seconds),
      durationSeconds: seconds,
      location: location || null,
      photos: photoUrls,
      date: new Date().toISOString(),
      user: "Brandon", // In real app, this would be the logged-in user
    };

    const existingSessions = JSON.parse(localStorage.getItem("sessions") || "[]");
    existingSessions.unshift(session); // Add to beginning
    localStorage.setItem("sessions", JSON.stringify(existingSessions));
    
    // Reset everything
    setSeconds(0);
    setShowSaveForm(false);
    setTitle("");
    setLocation("");
    setWorkDescription("");
    setPhotos([]);
    
    // Redirect to profile
    router.push("/profile");
  };

  const handleCancel = () => {
    setSeconds(0);
    setShowSaveForm(false);
    setTitle("");
    setLocation("");
    setWorkDescription("");
    setPhotos([]);
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setPhotos(Array.from(e.target.files));
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f7f4] text-[#2d2d2a]">
      <Nav />

      <main className="mx-auto max-w-2xl px-6 py-16">
        {!showSaveForm ? (
          // Timer view
          <div className="border-[8px] border-[#f0ede6] bg-[#fdfcfa] p-12 shadow-lg">
            <h1 className="mb-12 text-center font-serif text-2xl font-light italic tracking-tight text-[#2d2d2a]">
              {isRunning ? "In focus" : "Ready when you are"}
            </h1>

            {/* Time Display */}
            <div className="mb-12 text-center font-light text-7xl tabular-nums text-[#2d2d2a]">
              {formatTime(seconds)}
            </div>

            {/* Controls */}
            <div className="flex justify-center gap-4">
              {!isRunning ? (
                <button
                  onClick={handleStart}
                  className="border border-[#2d2d2a] border-opacity-30 bg-[#2d2d2a] px-12 py-4 font-light uppercase tracking-[0.15em] text-[#fdfcfa] transition-all hover:shadow-md"
                >
                  Begin
                </button>
              ) : (
                <button
                  onClick={handleStop}
                  className="border border-[#2d2d2a] border-opacity-30 bg-[#fdfcfa] px-12 py-4 font-light uppercase tracking-[0.15em] text-[#2d2d2a] transition-all hover:shadow-md"
                >
                  Finish
                </button>
              )}
            </div>

            {!isRunning && (
              <p className="mt-8 text-center text-sm font-light italic text-[#6b6b66]">
                You'll add details after
              </p>
            )}
          </div>
        ) : (
          // Save form view (shown after stopping timer)
          <div className="border-[8px] border-[#f0ede6] bg-[#fdfcfa] p-8 shadow-lg">
            <h1 className="mb-2 text-center font-serif text-2xl font-light italic tracking-tight text-[#2d2d2a]">
              {formatTime(seconds)}
            </h1>
            <p className="mb-8 text-center text-sm font-light italic text-[#6b6b66]">
              Tell us what you created
            </p>

            <div className="space-y-6">
              <div>
                <label className="mb-2 block text-sm font-light text-[#2d2d2a]">
                  Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="What did you work on?"
                  className="w-full border border-[#2d2d2a] border-opacity-20 bg-white px-4 py-2.5 font-light text-[#2d2d2a] placeholder:text-[#6b6b66] placeholder:opacity-40 focus:border-opacity-40 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-light text-[#2d2d2a]">
                  Description
                </label>
                <textarea
                  value={workDescription}
                  onChange={(e) => setWorkDescription(e.target.value)}
                  placeholder="Chapter 5, problem sets, essay draft..."
                  rows={3}
                  className="w-full border border-[#2d2d2a] border-opacity-20 bg-white px-4 py-2.5 font-light text-[#2d2d2a] placeholder:text-[#6b6b66] placeholder:opacity-40 focus:border-opacity-40 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-light text-[#2d2d2a]">
                  Location <span className="text-[#6b6b66]">(optional)</span>
                </label>
                <input
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Library, coffee shop, home..."
                  className="w-full border border-[#2d2d2a] border-opacity-20 bg-white px-4 py-2.5 font-light text-[#2d2d2a] placeholder:text-[#6b6b66] placeholder:opacity-40 focus:border-opacity-40 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-light text-[#2d2d2a]">
                  Photos <span className="text-[#6b6b66]">(optional)</span>
                </label>
                <div className="border border-[#2d2d2a] border-opacity-20 bg-white p-4">
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoChange}
                    className="w-full text-sm font-light text-[#2d2d2a] file:mr-4 file:border file:border-[#2d2d2a] file:border-opacity-30 file:bg-[#2d2d2a] file:px-4 file:py-2 file:font-light file:text-[#fdfcfa]"
                  />
                  {photos.length > 0 && (
                    <p className="mt-2 text-sm font-light italic text-[#6b6b66]">
                      {photos.length} photo{photos.length > 1 ? "s" : ""} selected
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  onClick={handleSave}
                  disabled={!title || !workDescription}
                  className="flex-1 border border-[#2d2d2a] border-opacity-30 bg-[#2d2d2a] px-8 py-3 font-light uppercase tracking-[0.15em] text-[#fdfcfa] transition-all hover:shadow-md disabled:opacity-30"
                >
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="border border-[#2d2d2a] border-opacity-30 bg-[#fdfcfa] px-8 py-3 font-light uppercase tracking-[0.15em] text-[#2d2d2a] transition-all hover:shadow-md"
                >
                  Discard
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
