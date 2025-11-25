"use client";

import { isUserExist } from "@/lib/users";
import { useState } from "react";

type Props = {};

export default function FindFriendModal({}: Props) {
  const [resp, setResp] = useState("");
  async function handleSubmit(formData: FormData) {
    const id = formData.get("id");

    //guard to make sure it string
    if (typeof id !== "string") {
      console.log("Invalid ID");
      return;
    }

    const boolUser = await isUserExist(id);
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
        <input id="userid" name="id" placeholder="friend id here..." />
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
