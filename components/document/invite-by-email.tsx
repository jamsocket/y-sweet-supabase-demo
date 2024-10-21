"use client"

import React from "react";
import { createClient } from "../../utils/supabase/client";

interface InviteByEmailProps {
  id: string;
  setToolTipMessage: (message: string) => void
}

export default function InviteByEmail(props: InviteByEmailProps) {
    const { id, setToolTipMessage } = props;
    const [newEmail, setNewEmail] = React.useState(""); // Track new email input
    const [selectedRole, setSelectedRole] = React.useState("read"); // Track selected role
    const [error, setError] = React.useState(""); // Track error message

    const supabase = createClient();

    async function addPerson() {

      const { data: user, error: userError } = await supabase
        .from('users')
        .select('id')
        .eq('email', newEmail)
        .single()

      if(!user || userError) {
        console.error("User not found", userError);
        setError("User not found");
        return;
      }

      const { error } = await supabase
      .from("permissions")
      .insert([{ doc_id: id, user_id: user.id, permission_type: selectedRole }])
      .select();

      if (error) {
        console.error("Failed to insert permission", error);
        setError("Failed to provide permission to user");
        return;
      }
      setToolTipMessage('User added')
      setTimeout(() => setToolTipMessage(''), 2000)
      setNewEmail('')
    }

    return(
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
          <AccessDropdown selectedRole={selectedRole} setSelectedRole={setSelectedRole}/>
          <button
            onClick={() => addPerson()}
            className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none"
          >
            Add
          </button>
        </div>
        <span className="text-xs text-red-700">{error}</span>
        </div>
    )
  }

  interface AccessDropdownProps {
    selectedRole: string;
    setSelectedRole: (role: string) => void;
  }
  export function AccessDropdown(props: AccessDropdownProps) {
    const { selectedRole, setSelectedRole } = props;
    const [isOpen, setIsOpen] = React.useState(false); // Toggle dropdown visibility

    const toggleDropdown = () => setIsOpen(!isOpen);

    const selectRole = (role: string) => {
      setSelectedRole(role);
      setIsOpen(false); // Close dropdown after selection
    };

    return (
      <div className="relative inline-block text-left">
        {/* Button to toggle dropdown */}
        <button
          onClick={toggleDropdown}
          className="inline-flex justify-between items-center w-full px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-md border border-gray-300 shadow-sm hover:bg-gray-200 focus:outline-none"
        >
          {selectedRole}
          <svg
            className="w-4 h-4 ml-2 -mr-1"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {/* Dropdown Menu */}
        {isOpen && (
          <div className="absolute z-10 mt-2 w-40 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
            <div className="py-1">
              {/* Dropdown options */}
              <button
                onClick={() => selectRole("read")}
                className={`block px-4 py-2 text-sm w-full text-left ${
                  selectedRole === "read" ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"
                }`}
              >
                Read
              </button>
              <button
                onClick={() => selectRole("write")}
                className={`block px-4 py-2 text-sm w-full text-left ${
                  selectedRole === "write" ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"
                }`}
              >
                Write
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
