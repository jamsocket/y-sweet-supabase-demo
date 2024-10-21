"use client"

import { createClient } from "../../utils/supabase/client";
import React from "react";

interface PermissionsToggleProps {
    docId: string;
    isPublic: boolean;
    setToolTipMessage: (message: string) => void
  }

  export default function PermissionsToggle(props: PermissionsToggleProps) {
    const { docId, isPublic, setToolTipMessage } = props;
    const [isToggle, setIsToggle] = React.useState(isPublic); // Track toggle state
    const supabase = createClient();

    const handleToggle = () => {
      setIsToggle(!isToggle); // Toggle the state between true and false
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
