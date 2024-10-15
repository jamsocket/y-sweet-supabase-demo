"use client";
import React, { useEffect } from "react";
import { YDocProvider } from "@y-sweet/react";
import { usePathname } from "next/navigation";
import { createClient } from "../../../../utils/supabase/client";
import { VoxelEditor } from "../../../../components/MyEditor";

export default function Docs() {
  const pathname = usePathname();
  const docId = pathname.split("/").pop();
  console.log(docId);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  console.log(isModalOpen);


  const copyToClipboard = async () => {
    const textToCopy = `${window.location.origin}/protected/document/${docId}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true); // Show the "Link copied" pop-up

      // Hide the pop-up after 2 seconds
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };


  if (!docId) {
    return <div>Document not found</div>;
  }

  return (
    <div>
      <div className="bg-white w-full">
        <button className="bg-black p-6" onClick={() => setIsModalOpen(true)}>
          Share
        </button>
      </div>
      <YDocProvider docId={docId} authEndpoint="/api/auth">
        {/* <VoxelEditor /> */}
        <div></div>
      </YDocProvider>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg p-6 w-full max-w-lg text-black">
            <h2 className="text-lg font-medium mb-4">Share document</h2>
            <p className="mb-4">
              Share this document with others by making it public.
            </p>
            <AddByEmail docId={docId}/>
            <div className="flex items-center mb-4">
        <input
          type="email"
          placeholder="Add people, groups, and calendar events"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <AccessDropdown />
        <button
          onClick={addPerson}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none"
        >
          Add
        </button>
      </div>
            <div className="flex items-center gap-4">
              <div>Anyone with this link can</div>
              <AccessDropdown />

            </div>
            <div className="flex gap-4">
              <button
                className="flex items-center bg-gray-100 border border-gray-300 text-blue-600 px-4 py-2 rounded-full hover:bg-gray-200"
                onClick={() => {
                  copyToClipboard();
                }}
              >
                Copy Link
              </button>
              <button onClick={() => setIsModalOpen(false)}>Cancel</button>
              {/* Tooltip-like pop-up */}
              {copied && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-800 text-white text-sm py-1 px-3 rounded shadow-lg">
                  Link copied
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

interface AddByEmailProps {
  docId: string;
}
export function AddByEmail(props: AddByEmailProps) {
  const { docId } = props;
  const [newEmail, setNewEmail] = React.useState(""); // Track new email input

  const supabase = createClient();


  async function addPerson() {
    const { data, error } = await supabase
    .from("permissions")
    .insert([{ doc_id: docId, email: newEmail, permission_type: "write" }])
    .select();

    // some email service would need to be added here
  }

  return(
    <div className="flex items-center mb-4">
        <input
          type="email"
          placeholder="Add people, groups, and calendar events"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <AccessDropdown />
        <button
          onClick={addPerson}
          className="px-4 py-2 bg-blue-500 text-white rounded-r-md hover:bg-blue-600 focus:outline-none"
        >
          Add
        </button>
      </div>
  )
}
export function AccessDropdown() {
  const [isOpen, setIsOpen] = React.useState(false); // Toggle dropdown visibility
  const [selectedRole, setSelectedRole] = React.useState("Read"); // Track selected role

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
              onClick={() => selectRole("Read")}
              className={`block px-4 py-2 text-sm w-full text-left ${
                selectedRole === "Read" ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"
              }`}
            >
              Read
            </button>
            <button
              onClick={() => selectRole("Write")}
              className={`block px-4 py-2 text-sm w-full text-left ${
                selectedRole === "Write" ? "bg-gray-100 font-semibold" : "hover:bg-gray-50"
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
