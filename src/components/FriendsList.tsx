"use client";

import { useState } from "react";

interface Friend {
  id: string;
  name: string;
  totalHours: number;
  currentStreak: number;
}

interface FriendsListProps {
  friends?: Friend[];
}

export function FriendsList({ friends = [] }: FriendsListProps) {
  const mockFriends: Friend[] = [
    { id: "1", name: "Alice Smith", totalHours: 12, currentStreak: 5 },
    { id: "2", name: "Bob Johnson", totalHours: 20, currentStreak: 10 },
    { id: "3", name: "Charlie Brown", totalHours: 8, currentStreak: 2 },
  ];

  const [isModalOpen, setModalOpen] = useState(false);

  const getInitial = (name: string): string => {
    return name
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase())
      .join("");
  };

  const getAllFriendNames = (friends: Friend[]): string[] => {
    return friends.map((friend) => friend.name);
  };

  return (
    <>
      <div className="">
        <button
          onClick={() =>
            !isModalOpen ? setModalOpen(true) : setModalOpen(false)
          }
          className="font-serif text-2xl font-light italic hover:text-[#6b6b66] transition-colors"
        >
          Friends
        </button>
        <span className="ml-2 font-serif text-2xl font-light italic text-[#6b6b66]">
          {friends.length}
        </span>
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 z-10 flex items-center justify-center"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="border-[2px] bg-gray-100 p-12"
            onClick={(e) => e.stopPropagation()}
          >
            <h1 className="font-bold pb-1 w-full h-full bg-grey">
              List of Friends
            </h1>
            {getAllFriendNames(mockFriends).map((friend_name, index) => (
              <div key={index}>{friend_name}</div>
            ))}
          </div>
        </div>
      )}
    </>
  );
}
