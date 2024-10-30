"use client";

import { useRef, useState } from "react";
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
  const [error, setError] = useState("");
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (docMetadata) {
      setDocMetadata({
        ...docMetadata,
        name: e.target.value,
      });
    }

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      debounceTimeoutRef.current = null;
      const error = await editDocTitle(docId, e.target.value);
      if (error) {
        setError(error);
      }
      setTimeout(() => setError(""), 4000);
    }, 1000);
  };

  return (
    <>
      <Input
        value={docMetadata?.name ?? ""}
        onChange={handleInputChange}
        className="text-2xl font-bold mb-4 w-fit"
        placeholder="Untitled Document"
      />
      {error && <p className="text-red-500">{error}</p>}
    </>
  );
}
