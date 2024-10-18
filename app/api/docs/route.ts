export const dynamic = "force-dynamic"; // static by default, unless reading the request\
import { createDoc } from "@y-sweet/sdk";
import { createClient } from "../../../utils/supabase/client";

export async function POST(request: Request) {
  // console.log('1')
  // const supabase = createClient()
  // console.log('2')
  const ysweetDoc = await createDoc(
    process.env.Y_SWEET_CONNECTION_STRING ?? "",
  );

  return new Response(JSON.stringify(ysweetDoc));
  // console.log('3')
  // const { data: {user}, error: userError } = await supabase.auth.getUser();
  // console.log('4', console.log(user), console.log(userError))
  // if (userError || !user) {
  //     return new Response(JSON.stringify(userError), { status: 500 })
  // }
  // console.log('5')
  // const { data: docData, error: docError } = await supabase
  //     .from('docs')
  //     .insert([
  //         { name: ysweetDoc.docId},
  //     ])
  //     .select()
  //     console.log('6')
  //     if (docError) {
  //         return new Response(JSON.stringify(docError), { status: 500 });
  //     }
  //     console.log('7')
  //     // Insert permission for the user in the 'permissions' table
  //     const { data: permData, error: permError } = await supabase
  //     .from('permissions')
  //     .insert([
  //         { user_id: user.id, doc_id: docData[0].id, permission_type: 'write' }, // Adjust permission_type as needed
  //     ])
  //     .select();
  //     console.log('8')
  // if (permError) {
  //     return new Response(JSON.stringify(permError), { status: 500 });
  // }
  // console.log('9')

  //   return new Response(`Hello from ${process.env.VERCEL_REGION}`);
}
