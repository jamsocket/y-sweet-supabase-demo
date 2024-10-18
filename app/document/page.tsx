import { createClient } from "@/utils/supabase/server";
import CreateDoc from "@/components/create-doc";
import DisplayDocs from "@/components/display-docs";
import { redirect } from "next/navigation";

export default async function DocumentHome() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/sign-in");
  }

  // Fetch all documents from the docs table
  const { data: docs, error } = await supabase.from("docs").select("*"); // Select the doc_id field (or others as needed)

  if (error) {
    console.error("Error fetching documents:", error);
    return <div>Error fetching documents</div>;
  }

  return (
    <div className="w-full flex flex-col items-center gap-8 p-4 mx-auto">
      <CreateDoc />
      <DisplayDocs />
    </div>
  );
}
