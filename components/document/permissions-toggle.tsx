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
  const [isPublic, setIsPublic] = React.useState(documentMetadata.is_public); // Track toggle state

  const handleToggle = async () => {
    setIsPublic(!isPublic); // Toggle the state between true and false

    const error = await changeDocVisibility(!isPublic, docId);
    if (error) {
      setToolTipMessage(error);
      setIsPublic(isPublic);
    } else {
      setDocumentMetadata({ ...documentMetadata, is_public: !isPublic });
      setToolTipMessage(
        !isPublic ? "Document made public" : "Document made private",
      );
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
            isPublic ? "bg-green-500" : "bg-gray-300"
          }`}
        >
          <div
            className={`bg-white w-6 h-6 rounded-full shadow-md transform transition-transform duration-300 ${
              isPublic ? "translate-x-8" : "translate-x-0"
            }`}
          ></div>
        </div>
      </div>
    </div>
  );
}
