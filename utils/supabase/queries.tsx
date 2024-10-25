"use server";
import { createClient } from "./server";

const supabase = createClient();

export async function addUserToDoc(newEmail: string, id: string) {
    // In a production environment, you should verify the user's permission to share the specified doc_id.
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", newEmail)
      .single();

    if (!user || userError) {
      console.error("User not found", userError);
      return "User not found"
    }

    const { error } = await supabase
      .from("permissions")
      .insert([{ doc_id: id, user_id: user.id }])
      .select();

    if (error) {
      console.error("Failed to insert permission", error);
      return "Failed to provide permission to user"
    }
}


export async function editDocTitle(docId: string, newName: string) {
    // In a production environment, you should check that the user has permission to edit the doc and add error handling.
    await supabase
    .from("docs")
    .update({ name: newName })
    .eq("doc_id", docId);
}

export async function changeDocVisibility(isPublic: boolean, docId: string) {
    // In a production environment, you should check that the user has permission to edit the doc and add error handling.
    const { data, error } = await supabase
    .from("docs")
    .update({ is_public: isPublic })
    .eq("doc_id", docId);

    if(error) {
      console.error("Failed to update doc visibility", error);
      return "Failed to update doc visibility"
    }
}
