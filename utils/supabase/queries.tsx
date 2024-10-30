"use server";

import { createClient } from "./server";
import { manager } from "../y-sweet-document-manager";

export async function addUserToDoc(newEmail: string, docId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) {
    return "User not authenticated";
  }

  const { data: permissionsData, error: permError } = await supabase
    .from("permissions")
    .select("id")
    .eq("doc_id", docId)
    .eq("user_id", user.id);

  if (permError || !permissionsData?.length) {
    console.error(
      "User does not have permission to invite other users to this document",
      permError,
    );
    return "User does not have permission to invite other users to this document";
  }

  const { data: invitedUser, error: userError } = await supabase
    .from("users")
    .select("id")
    .eq("email", newEmail)
    .single();

  if (!invitedUser || userError) {
    console.error("Invited user not found", userError);
    return "Invited user not found";
  }

  const { error } = await supabase
    .from("permissions")
    .insert([{ doc_id: docId, user_id: invitedUser.id }])
    .select();

  if (error) {
    console.error("Failed to insert permission", error);
    return "Failed to provide permission to user";
  }
}

export async function editDocTitle(docId: string, newName: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) {
    return "User not authenticated";
  }

  const { data: permissionsData, error: permError } = await supabase
    .from("permissions")
    .select("*")
    .eq("doc_id", docId)
    .eq("user_id", user.id);

  if (permError || !permissionsData?.length) {
    console.error(
      "User does not have access to edit the title of this document",
      permError,
    );
    return "User does not have access to edit the title of this document";
  }
  await supabase.from("docs").update({ name: newName }).eq("id", docId);
}

export async function changeDocVisibility(isPublic: boolean, docId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user?.id) {
    return "User not authenticated";
  }

  const { data: permissionsData, error: permError } = await supabase
    .from("permissions")
    .select("*")
    .eq("doc_id", docId)
    .eq("user_id", user.id);

  if (permError || !permissionsData?.length) {
    console.error(
      "User does not have access to change visibility of this document",
      permError,
    );
    return "User does not have access to change visibility of this document";
  }

  const { error } = await supabase
    .from("docs")
    .update({ is_public: isPublic })
    .eq("id", docId);

  if (error) {
    console.error("Failed to update doc visibility", error);
    return "Failed to update doc visibility";
  }
}

export async function getDocMetadata(docId: string) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user?.id) {
    return {
      data: null,
      error: "User not authenticated",
    };
  }

  const { data: docsData, error } = await supabase
    .from("docs")
    .select("*")
    .eq("id", docId);

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
  }

  const { data: permissionsData, error: permError } = await supabase
    .from("permissions")
    .select("id")
    .eq("doc_id", docsData[0].id)
    .eq("user_id", user.id);

  if (permError || !permissionsData?.length) {
    console.error("User does not have access to this document", permError);
    return {
      data: null,
      error: "User does not have access to this document",
    };
  }
  return {
    data: docsData[0],
    error: null,
  };
}

export async function getDocs() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      data: null,
      error: "User not authenticated",
    };
  }

  const { data: permissionData, error: permissionError } = await supabase
    .from("permissions")
    .select("doc_id")
    .eq("user_id", user.id);

  if (permissionError) {
    console.error("Error fetching permissions:", permissionError);
    return {
      data: null,
      error: "Error fetching permissions",
    };
  }

  const docIds = permissionData?.map((permission) => permission.doc_id) || [];

  if (docIds.length === 0) {
    console.log("No documents found for the user");
    return {
      data: [],
      error: null,
    };
  }

  const { data: docsData, error: docsError } = await supabase
    .from("docs")
    .select("id, is_public, name")
    .in("id", docIds);

  if (docsError) {
    console.error("Error fetching documents:", docsError);
    return {
      data: null,
      error: "Error fetching documents",
    };
  }

  const transformedDocs = docsData?.map((doc: any) => ({
    doc_id: doc.id,
    name: doc.name ?? "Untitled Document",
  }));

  return {
    data: transformedDocs,
    error: null,
  };
}

export async function createDoc() {
  const supabase = createClient();
  const ysweetDoc = await manager.createDoc();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return {
      data: null,
      error: "User not authenticated",
    };
  }

  const { data: docData, error: docError } = await supabase
    .from("docs")
    .insert([{ id: ysweetDoc.docId }])
    .select();

  if (docError) {
    return {
      data: null,
      error: `Failed to insert doc: ${docError.message}`,
    };
  }

  const { error: permError } = await supabase
    .from("permissions")
    .insert([{ user_id: user.id, doc_id: docData[0].id }])
    .select();

  if (permError) {
    return {
      data: null,
      error: `Failed to insert permission: ${permError.message}`,
    };
  }

  return {
    data: ysweetDoc.docId,
    error: null,
  };
}
