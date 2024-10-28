"use client";

import type { DocumentMetadata } from "../../app/document/[id]/page";
import { Input } from "../ui/input";
import { editDocTitle } from "@/utils/supabase/queries";

interface EditableDocTitleProps {
  docId: string;
  setDocMetadata: (metadata: DocumentMetadata) => void;
  docMetadata: DocumentMetadata | null;
}

export default function EditableDocTitle(props: EditableDocTitleProps) {
  const { docId, setDocMetadata, docMetadata } = props;
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (docMetadata) {
      setDocMetadata({
        ...docMetadata,
        name: e.target.value,
      });
    }
    let inThrottle = false;
    if (!inThrottle) {
      inThrottle = true;

      await editDocTitle(docId, e.target.value);

      setTimeout(() => {
        inThrottle = false;
      }, 1000);
    }
  };

  return (
    <Input
      value={docMetadata?.name ?? ""}
      onChange={handleInputChange}
      className="text-2xl font-bold mb-4 w-fit"
      placeholder="Untitled Document"
    />
  );
}
