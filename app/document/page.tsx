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

  return (
    <div className="w-full flex flex-col items-center gap-8 p-4 mx-auto">
      <CreateDoc />
      <DisplayDocs />
    </div>
  );
}
