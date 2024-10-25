"use client";
import React from "react";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function CreateDoc() {
  const router = useRouter();
  const supabase = createClient();

  const createDoc = async () => {
    let response = await fetch("/api/docs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const ysweetDoc = await response.json();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("User not authenticated");
      return;
    }

    const { data: docData, error: docError } = await supabase
      .from("docs")
      .insert([{ doc_id: ysweetDoc.docId }])
      .select();

    if (docError) {
      alert(`Failed to insert doc: ${docError.message}`);
      return;
    }

    const { error: permError } = await supabase
      .from("permissions")
      .insert([{ user_id: user.id, doc_id: docData[0].id }])
      .select();

    if (permError) {
      alert(`Failed to insert permission: ${permError.message}`);
      return;
    }

    router.push(`/document/${ysweetDoc.docId}`);
  };

  return (
    <>
      <Button onClick={() => createDoc()}>+ Create new doc</Button>
    </>
  );
}
