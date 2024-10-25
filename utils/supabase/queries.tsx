"use server";
import { createClient } from "./server";
import { createDoc as createYSweetDoc } from "@y-sweet/sdk";

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

export async function getDocs() {
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
    .select("id, doc_id, is_public, name")
    .in("id", docIds);

  if (docsError) {
    console.error("Error fetching documents:", docsError);
    return {
      data: null,
      error: "Error fetching documents",
    };
  }

  const transformedDocs = docsData?.map((doc: any) => ({
    doc_id: doc.doc_id,
    name: doc.name ?? "Untitled Document",
  }));

  return {
    data: transformedDocs,
    error: null,
  };
}

export async function createDoc() {
  const ysweetDoc = await createYSweetDoc(
    process.env.Y_SWEET_CONNECTION_STRING ?? "",
  );

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
    .insert([{ doc_id: ysweetDoc.docId }])
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
