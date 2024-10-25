"use client";

import React from "react";
import { changeDocVisibility } from "@/utils/supabase/queries";
import type { DocumentMetadata } from "@/app/document/[id]/page";

interface PermissionsToggleProps {
  docId: string;
  documentMetadata: DocumentMetadata;
  setDocumentMetadata: (metadata: DocumentMetadata) => void;
  setToolTipMessage: (message: string) => void;
}

export default function PermissionsToggle(props: PermissionsToggleProps) {
  const { docId, documentMetadata, setDocumentMetadata, setToolTipMessage } =
    props;
  const [isToggle, setIsToggle] = React.useState(documentMetadata.is_public); // Track toggle state

  const handleToggle = async () => {
    setIsToggle(!isToggle); // Toggle the state between true and false
    setToolTipMessage(
      !isToggle ? "Document made public" : "Document made private",
    );

    let error = await changeDocVisibility(!isToggle, docId);
    if (!error) {
      setDocumentMetadata({ ...documentMetadata, is_public: !isToggle });
    }

    setTimeout(() => {
      setToolTipMessage("");
    }, 2000);
  };

  return (
    <div className="flex items-center gap-4">
      <div>Make this document public</div>
      <div className="flex items-center justify-center">
        <div
          onClick={() => handleToggle()}
          className={`w-16 h-8 flex items-center bg-gray-300 rounded-full p-1 cursor-pointer transition-colors duration-300 ${
            isToggle ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <div
            className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
              isToggle ? "translate-x-8" : "translate-x-0"
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
}
