import { DocumentManager } from "@y-sweet/sdk";
import { NextResponse } from "next/server";

const manager = new DocumentManager(
process.env.Y_SWEET_CONNECTION_STRING ?? '');

export async function POST(request: Request) {
  // In a production app, this is where you'd authenticate the user
  // and check that they are authorized to access the doc.
  const { docId } = await request.json();
  const clientToken = await manager.getOrCreateDocAndToken(docId);
  return NextResponse.json(clientToken);
}
