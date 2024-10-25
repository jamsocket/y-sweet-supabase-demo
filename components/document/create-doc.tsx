"use client";
import React from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { createDoc } from "@/utils/supabase/queries";

export default function CreateDoc() {
  const router = useRouter();

  const onCreateDoc = async () => {
    let {data, error} = await createDoc();

    if (error) {
      console.error(error);
      return;
    }

    router.push(`/document/${data}`);
  };

  return <Button onClick={() => onCreateDoc()}>+ Create new doc</Button>
}
