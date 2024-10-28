import { manager } from "@/utils/y-sweet-document-manager";

export async function POST(request: Request) {
  // In a production app, this is where you'd authenticate the user
  // and check that they are authorized to access the doc.
  const { docId } = await request.json();
  const clientToken = await manager.getOrCreateDocAndToken(docId);
  return Response.json(clientToken);
}
