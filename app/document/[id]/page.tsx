"use client";
import React, { useEffect } from "react";
import { YDocProvider } from "@y-sweet/react";
import { usePathname } from "next/navigation";
import { SlateEditor } from "../../../components/slate/SlateEditor";
import { Button } from "../../../components/ui/button";
import EditableDocTitle from "../../../components/document/editable-doc-title";
import CopyLink from "../../../components/document/copy-link";
import PermissionsToggle from "../../../components/document/permissions-toggle";
import InviteByEmail from "../../../components/document/invite-by-email";
import { getDocMetadata } from "@/utils/supabase/queries";

export type DocumentMetadata = {
  name: string;
  id: string;
  doc_id: string;
  is_public: boolean;
};

export default function DocumentPage() {
  const pathname = usePathname();
  const docId = pathname.split("/").pop();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [toolTipMessage, setToolTipMessage] = React.useState("");
  const [docMetadata, setDocMetadata] = React.useState<DocumentMetadata | null>(
    null,
  );
  const [error, setError] = React.useState("");

  useEffect(() => {
    async function fetchDocMetadata() {
      if (!docId) return;

      let { data: docsData, error } = await getDocMetadata(docId);

      if (error || !docsData) {
        setError(error ?? "Document not found");
        return;
      }

      if (docsData) {
        setDocMetadata({
          name: docsData.name ?? "Untitled Document",
          id: docsData.id,
          doc_id: docsData.doc_id,
          is_public: docsData.is_public,
        });
      }
    }

    fetchDocMetadata();
  }, [docId]);

  if (!docId || error) {
    return <div>{error ?? "Document not found"}</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center py-3 text-sm">
        <EditableDocTitle
          docId={docId}
          setDocMetadata={setDocMetadata}
          docMetadata={docMetadata}
        />
        <Button onClick={() => setIsModalOpen(true)}>Share</Button>
      </div>
      <YDocProvider docId={docId} authEndpoint="/api/auth">
        <SlateEditor />
      </YDocProvider>
      {isModalOpen && docMetadata && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="relative bg-white rounded-lg p-6 w-full max-w-lg text-black ">
            <h2 className="text-2xl mb-4">Share document</h2>
            <InviteByEmail
              id={docMetadata.id}
              setToolTipMessage={setToolTipMessage}
            />
            <PermissionsToggle
              docId={docId}
              documentMetadata={docMetadata}
              setDocumentMetadata={setDocMetadata}
              setToolTipMessage={setToolTipMessage}
            />
            <div className="flex gap-4 pt-6">
              <CopyLink docId={docId} setToolTipMessage={setToolTipMessage} />
              <button onClick={() => setIsModalOpen(false)}>Done</button>
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
