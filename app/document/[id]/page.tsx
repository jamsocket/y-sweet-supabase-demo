"use client";
import React, { useEffect } from "react";
import { YDocProvider } from "@y-sweet/react";
import { usePathname } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";
import { SlateEditor } from "../../../components/slate/SlateEditor";
import { Button } from "../../../components/ui/button";
import { Input } from "../../../components/ui/input";

export default function Docs() {
  const pathname = usePathname();
  const docId = pathname.split("/").pop();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [toolTipMessage, setToolTipMessage] = React.useState('');
  const [docMetadata, setDocMetadata] = React.useState<{
    name: string;
    id: string;
    doc_id: string;
    is_public: boolean;
  }>({
    name: "",
    id: "",
    doc_id: "",
    is_public: false,
  });

  const [hasAccess, setHasAccess] = React.useState(false);
  const supabase = createClient();

  useEffect(() => {
    async function fetchDocs() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: docsData, error } = await supabase
      .from("docs")
      .select("*")
      .eq("doc_id", docId);

      console.log(docsData)

      if(!docsData || docsData.length === 0) {
        console.error("Document not found");
        return;
      }

      setDocMetadata({
        name: docsData[0].name ?? "Untitled Document",
        id: docsData[0].id,
        doc_id: docsData[0].doc_id,
        is_public: docsData[0].is_public ?? false,
      });

      if (docsData[0]?.is_public) {
        // If public, grant access
        setHasAccess(true);
      } else {
        // Step 3: Check if the user has access in the permissions table
        const { data: permissionsData, error: permError } = await supabase
        .from("permissions")
        .select("permission_type")
        .eq("doc_id", docsData[0].id) // Match the document by its id
        .eq("user_id", user?.id) // Ensure user.id is being passed here
        .single();

        if (permError || !permissionsData) {
          console.error("User does not have access to this document", permError);
        } else {
          // If user has permissions, grant access
          setHasAccess(true);
        }
      }
    }

    fetchDocs();
  }, [docId])

  const copyToClipboard = async () => {
    const textToCopy = `${window.location.origin}/document/${docId}`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setToolTipMessage("Link Copied!"); // Show the "Link copied" pop-up

      // Hide the pop-up after 2 seconds
      setTimeout(() => setToolTipMessage(''), 2000);
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  if(!hasAccess) {
    return <div>Unauthorized</div>;
  }

  if (!docId) {
    return <div>Document not found</div>;
  }


  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setDocMetadata((prevMetadata) => ({
      ...prevMetadata,      // Spread the previous metadata properties
      name: e.target.value  // Only update the name property
    }));

    let inThrottle = false
    if (!inThrottle) {
      inThrottle = true

      await supabase
      .from("docs") // Assuming your table name is "docs"
      .update({ name: e.target.value }) // Update the name field
      .eq("doc_id", docId); // Match the document by its id

      setTimeout(() => {
        inThrottle = false
      }, 1000);  // Throttle time of 1 second
    }

};


  return (
    <div className="">
      <div className="flex justify-between items-center py-3 text-sm">
      <Input
        value={docMetadata.name  ?? ""}
        onChange={handleInputChange}
        // onKeyDown={handleKeyDown}
        className="text-2xl font-bold mb-4 w-fit"
        placeholder="Enter document name"
      />
      {<Button onClick={() => setIsModalOpen(true)}>
          Share
        </Button>}
      </div>
      <YDocProvider docId={docId} authEndpoint="/api/auth">
        <SlateEditor/>
      </YDocProvider>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg p-6 w-full max-w-lg text-black ">
            <h2 className="text-2xl mb-4">Share document</h2>
            <AddByEmail id={docMetadata.id} setToolTipMessage={setToolTipMessage}/>
            <LinkPermissions docId={docId} isPublic={docMetadata.is_public} setToolTipMessage={setToolTipMessage}/>
            <div className="flex gap-4 pt-6">
              <button
                className="flex items-center bg-gray-100 border border-blue-300 text-blue-600 px-4 py-2 rounded-full hover:bg-gray-200"
                onClick={() => {
                  copyToClipboard();
                }}
              >
                Copy Link
              </button>
              <button onClick={() => setIsModalOpen(false)}>Done</button>
              {/* Tooltip-like pop-up */}
              {toolTipMessage && (
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-gray-800 text-white text-sm py-1 px-3 rounded shadow-lg">
                  {toolTipMessage}
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
  id: string;
  setToolTipMessage: (message: string) => void
}

interface LinkPermissionsProps {
  docId: string;
  isPublic: boolean;
  setToolTipMessage: (message: string) => void
}

export function LinkPermissions(props: LinkPermissionsProps) {
  const { docId, isPublic, setToolTipMessage } = props;
  const [isToggle, setIsToggle] = React.useState(isPublic); // Track toggle state
  const supabase = createClient();

  const handleToggle = () => {
    console.log('handle toggle')
    setIsToggle(!isToggle); // Toggle the state between true and false

    console.log(isToggle)
    setToolTipMessage(!isToggle ? 'Document made public' : 'Document made private')

    async function updateDocMetadata() {
    // Update the document's public status in Supabase
      const { data: docsData, error } = await supabase
        .from("docs")
        .update({ is_public: !isToggle }) // Toggle the is_public field
        .eq("doc_id", docId) // Match the document by its id
    }

    setTimeout(() => {
      setToolTipMessage('')
    }, 2000)
    updateDocMetadata()
  };

  return(
    <div className="flex items-center gap-4">
      <div>Make this document public</div>
      <div className="flex items-center justify-center">
      {/* Toggle Button */}
      <div
        onClick={() => handleToggle()}
        className={`w-16 h-8 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
          isToggle ? 'bg-green-500' : 'bg-gray-300'
        }`}
      >
        {/* Toggle Circle */}
        <div
          className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
            isToggle ? 'translate-x-8' : 'translate-x-0'
          }`}
        ></div>
      </div>
    </div>
    </div>
  )
}
export function AddByEmail(props: AddByEmailProps) {
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
      console.log(user)

    if(!user || userError) {
      console.error("User not found", userError);
      setError("User not found");
      return;
    }

    const { data, error } = await supabase
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
