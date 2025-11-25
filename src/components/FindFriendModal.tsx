"use client";

import { isUserExist } from "@/lib/users";
import { useState } from "react";

type Props = {};

export default function FindFriendModal({}: Props) {
  const [resp, setResp] = useState("");
  async function handleSubmit(formData: FormData) {
    const username = formData.get("username");

    //guard to make sure it string
    if (typeof username !== "string") {
      console.log("Invalid username");
      return;
    }

    const boolUser = await isUserExist(username);
    if (boolUser) {
      setResp("User Exist");
      console.log("user exist");
    } else {
      setResp("User Does Not Exist");
      console.log("user not found");
    }
  }
  return (
    <>
      <form action={handleSubmit} className="flex flex-row gap-2">
        <label>add friend</label>
        <input id="username" name="username" placeholder="username here..." />
        <button type="submit">enter</button>
      </form>
      <div
        className={`font-sm ${
          resp === "User Exist" ? "text-green-500" : "text-red-500"
        }`}
      >
        {resp}
      </div>
    </>
  );
}
