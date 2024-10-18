"use client"

import type { DocumentMetadata } from "../../app/document/[id]/page";
import { createClient } from "../../utils/supabase/client";
import { Input } from "../ui/input";

interface EditableDocTitleProps {
    docId: string;
    setDocMetadata: (metadata) => void;
    docMetadata: DocumentMetadata | null;
  }

  export default function EditableDocTitle(props: EditableDocTitleProps) {
    const { docId, setDocMetadata, docMetadata } = props;
    const supabase = createClient();
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

    return(
      <Input
      value={docMetadata?.name  ?? ""}
      onChange={handleInputChange}
      className="text-2xl font-bold mb-4 w-fit"
      placeholder="Untitled Document"
    />
    )
  }
