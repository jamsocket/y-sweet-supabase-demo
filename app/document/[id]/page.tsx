"use client";
import React, { useEffect } from "react";
import { YDocProvider } from "@y-sweet/react";
import { usePathname } from "next/navigation";
import { createClient } from "../../../utils/supabase/client";
import { SlateEditor } from "../../../components/slate/SlateEditor";
import { Button } from "../../../components/ui/button";
import EditableDocTitle from "../../../components/document/editable-doc-title";
import CopyLink from "../../../components/document/copy-link";
import PermissionsToggle from "../../../components/document/permissions-toggle";
import InviteByEmail from "../../../components/document/invite-by-email";

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
  const [hasAccess, setHasAccess] = React.useState(false);
  const [docMetadata, setDocMetadata] = React.useState<DocumentMetadata | null>(
    null,
  );
  const supabase = createClient();

  useEffect(() => {
    async function fetchDocMetadata() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data: docsData } = await supabase
        .from("docs")
        .select("*")
        .eq("doc_id", docId);

      if (!docsData || docsData.length === 0) {
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
        setHasAccess(true);
      } else {
        const { data: permissionsData, error: permError } = await supabase
        .from("permissions")
        .select("id") // Only select the id to check for existence
        .eq("doc_id", docsData[0].id)
        .eq("user_id", user?.id);

        if (permError || !permissionsData) {
          console.error(
            "User does not have access to this document",
            permError,
          );
        } else {
          setHasAccess(true);
        }
      }
    }

    fetchDocMetadata();
  }, [docId]);

  if (!hasAccess) {
    return <div>Unauthorized</div>;
  }

  if (!docId) {
    return <div>Document not found</div>;
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
              isPublic={docMetadata.is_public}
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
