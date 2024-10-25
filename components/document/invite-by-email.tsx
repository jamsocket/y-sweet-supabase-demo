"use client";

import React from "react";
import { addUserToDoc } from "../../utils/supabase/queries";

interface InviteByEmailProps {
  id: string;
  setToolTipMessage: (message: string) => void;
}

export default function InviteByEmail(props: InviteByEmailProps) {
  const { id, setToolTipMessage } = props;
  const [newEmail, setNewEmail] = React.useState(""); // Track new email input
  const [error, setError] = React.useState(""); // Track error message

  async function inviteUser() {
    const email = newEmail.trim();

    if (!email) {
      setError("No email provided");
    } else {
      const error = await addUserToDoc(email, id);

      if (error) {
        setError(error);
      } else {
        setToolTipMessage("User added");
        setTimeout(() => setToolTipMessage(""), 2000);
      }
    }

    setNewEmail("");
  }

  return (
    <div>
      Add people by email
      <div className="flex items-center py-4">
        <input
          type="email"
          placeholder="invite-email@gmail.com"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 bg-white rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          onClick={() => inviteUser()}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none"
        >
          Add
        </button>
      </div>
      <span className="text-xs text-red-700">{error}</span>
    </div>
  );
}
