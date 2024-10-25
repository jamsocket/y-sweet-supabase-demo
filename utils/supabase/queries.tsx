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
    return "User not found";
  }

  const { error } = await supabase
    .from("permissions")
    .insert([{ doc_id: id, user_id: user.id }])
    .select();

  if (error) {
    console.error("Failed to insert permission", error);
    return "Failed to provide permission to user";
  }
}

export async function editDocTitle(docId: string, newName: string) {
  // In a production environment, you should check that the user has permission to edit the doc and add error handling.
  await supabase.from("docs").update({ name: newName }).eq("doc_id", docId);
}

export async function changeDocVisibility(isPublic: boolean, docId: string) {
  // In a production environment, you should check that the user has permission to edit the doc and add error handling.
  const { data, error } = await supabase
    .from("docs")
    .update({ is_public: isPublic })
    .eq("doc_id", docId);

  if (error) {
    console.error("Failed to update doc visibility", error);
    return "Failed to update doc visibility";
  }
}

export async function getDocMetadata(docId: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: docsData, error } = await supabase
    .from("docs")
    .select("*")
    .eq("doc_id", docId);

  if (!docsData || docsData.length === 0 || error) {
    console.error("Document not found", error);
    return {
      data: null,
      error: "Document not found",
    };
  }

  if (docsData[0]?.is_public) {
    return {
      data: docsData[0],
      error: null,
    };
  } else {
    const { data: permissionsData, error: permError } = await supabase
      .from("permissions")
      .select("id")
      .eq("doc_id", docsData[0].id)
      .eq("user_id", user?.id);

    if (permError || !permissionsData) {
      console.error("User does not have access to this document", permError);
      return {
        data: null,
        error: "User does not have access to this document",
      };
    } else {
      return {
        data: docsData[0],
        error: null,
      };
    }
  }
}
