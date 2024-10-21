export const dynamic = "force-dynamic"; // static by default, unless reading the request\
import { createDoc } from "@y-sweet/sdk";

export async function POST() {
  const ysweetDoc = await createDoc(
    process.env.Y_SWEET_CONNECTION_STRING ?? "",
  );

  return new Response(JSON.stringify(ysweetDoc));
}
