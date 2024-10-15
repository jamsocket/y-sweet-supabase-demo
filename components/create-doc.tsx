"use client";
import React from "react";
import { Button } from "./ui/button";
import { createClient } from "@/utils/supabase/client";

export default function CreateDoc() {
  const supabase = createClient();

  const createDoc = async () => {
    let response = await fetch("/api/docs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Set content type if you're sending JSON data
      },
    });

    const ysweetDoc = await response.json();

    // Check if user is authenticated
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      alert("User not authenticated");
      return;
    }

    // Insert the document into the 'docs' table
    const { data: docData, error: docError } = await supabase
      .from("docs")
      .insert([{ doc_id: ysweetDoc.docId }])
      .select();

    if (docError) {
      alert(`Failed to insert doc: ${docError.message}`);
      return;
    }

    console.log(user.id, docData, docData[0].id);
    // Insert user permission for the document
    const { data: permData, error: permError } = await supabase
      .from("permissions")
      .insert([
        { user_id: user.id, doc_id: docData[0].id, permission_type: "write" },
      ])
      .select();

    if (permError) {
      alert(`Failed to insert permission: ${permError.message}`);
      return;
    }

    alert("Doc created and permission set successfully");
  };

  return (
    <>
      <Button onClick={() => createDoc()}>Create new doc</Button>
    </>
  );
}
