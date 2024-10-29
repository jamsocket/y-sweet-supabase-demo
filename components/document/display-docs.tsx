"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getDocs } from "@/utils/supabase/queries";

type Docs = {
  doc_id: string;
  name: string;
};
export default function DisplayDocs() {
  const [docs, setDocs] = useState<Docs[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchDocs() {
      let { data, error } = await getDocs();
      if (error || !data) {
        console.error(error);
        setLoading(false);
        return;
      }

      setDocs(data);
      setLoading(false);
    }
    fetchDocs();
  }, []);

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-4 w-fit">Recent Documents</h2>
      <div className="flex flex-col gap-4">
        {loading && <p>Loading...</p>}
        {!loading && docs.length === 0 ? (
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
