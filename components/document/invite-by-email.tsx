"use client";

import React from "react";
import { createClient } from "../../utils/supabase/client";

interface InviteByEmailProps {
  id: string;
  setToolTipMessage: (message: string) => void;
}

export default function InviteByEmail(props: InviteByEmailProps) {
  const { id, setToolTipMessage } = props;
  const [newEmail, setNewEmail] = React.useState(""); // Track new email input
  const [error, setError] = React.useState(""); // Track error message

  const supabase = createClient();

  async function addPerson() {
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", newEmail)
      .single();

    if (!user || userError) {
      console.error("User not found", userError);
      setError("User not found");
      return;
    }

    // In a secure production environment, this operation should be handled within a server-side action, with proper authorization checks to verify the user's permission to share the specified doc_id.
    const { error } = await supabase
      .from("permissions")
      .insert([{ doc_id: id, user_id: user.id }])
      .select();

    if (error) {
      console.error("Failed to insert permission", error);
      setError("Failed to provide permission to user");
      return;
    }
    setToolTipMessage("User added");
    setTimeout(() => setToolTipMessage(""), 2000);
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
          onClick={() => addPerson()}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none"
        >
          Add
        </button>
      </div>
      <span className="text-xs text-red-700">{error}</span>
    </div>
  );
}
