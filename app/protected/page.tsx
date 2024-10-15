import { createClient } from "@/utils/supabase/server";
import CreateDoc from "@/components/create-doc";
import { redirect } from "next/navigation";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch all documents from the docs table
  const { data: docs, error } = await supabase.from("docs").select("doc_id"); // Select the doc_id field (or others as needed)

  if (error) {
    console.error("Error fetching documents:", error);
    return <div>Error fetching documents</div>;
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-12">
      <CreateDoc />
      <div>
        {docs.map((doc) => (
          <a href={`/protected/document/${doc.doc_id}`} key={doc.doc_id}>
            {doc.doc_id}
          </a>
        ))}
      </div>
    </div>
  );
}
