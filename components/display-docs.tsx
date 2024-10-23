"use client";
import React, { useEffect, useState } from "react";
import { createClient } from "../utils/supabase/client";
import { redirect } from "next/navigation";
import Link from "next/link";

type Docs = {
  doc_id: string;
  name: string;
};
export default function DisplayDocs() {
  const supabase = createClient();
  const [docs, setDocs] = useState<Docs[]>([]);

  useEffect(() => {
    async function fetchDocs() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return redirect("/sign-in");
      }

      // Step 1: Fetch document IDs where the user has 'read' or 'write' permissions
      const { data: permissionData, error: permissionError } = await supabase
        .from("permissions")
        .select("doc_id")
        .eq("user_id", user.id)

      if (permissionError) {
        console.error("Error fetching permissions:", permissionError);
        return;
      }

      // Extract the document IDs
      const docIds =
        permissionData?.map((permission) => permission.doc_id) || [];

      if (docIds.length === 0) {
        console.log("No documents found for the user");
        return;
      }

      // Step 2: Fetch documents using the fetched doc IDs
      const { data: docsData, error: docsError } = await supabase
        .from("docs")
        .select("id, doc_id, is_public, name")
        .in("id", docIds); // Use the fetched doc IDs to filter documents

      if (docsError) {
        console.error("Error fetching documents:", docsError);
      }

      const transformedDocs = docsData?.map((doc: any) => ({
        doc_id: doc.doc_id,
        name: doc.name ?? "Untitled Document", // Default to "Untitled Document" if name is null
      }));
      if (transformedDocs) {
        setDocs(transformedDocs);
      }
    }

    fetchDocs();
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 w-fit">Recent Documents</h2>
      <div className="flex flex-col gap-4">
        {docs.length === 0 ? (
          <p className="text-gray-500">
            No documents found. Start by creating a new document!
          </p>
        ) : (
          docs.map((doc) => (
            <Link
              href={`/document/${doc.doc_id}`}
              key={doc.doc_id}
              className="w-full flex justify-between items-center gap-3 py-1 border-b border-neutral-800 text-neutral-300 hover:text-white hover:border-neutral-200 transition-all"
            >
              <span>{doc.name ?? "Untitled Document"}</span>
              <span>{`->`}</span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
