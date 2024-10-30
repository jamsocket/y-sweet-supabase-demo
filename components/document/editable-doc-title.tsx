"use client";

import { useRef } from "react";
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
      // TODO: display this error message and revert the title
      const error = await editDocTitle(docId, e.target.value);
    }, 1000);
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
