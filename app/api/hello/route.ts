import type { NextRequest } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { drizzle } from "drizzle-orm/xata-http";
import { sql } from "drizzle-orm";
// edge runtime
export const runtime = "edge";

export async function GET(request: NextRequest) {
  let responseText = "Hello World";
  // const client = new Client({
  //   connectionString:
  //     "postgresql://sllj1f:xau_D1iXaZbeN4WYHR57Xx56ow1cGjRdTxwy@us-east-1.sql.xata.sh/premiumzone:main?sslmode=require",
  // });
  // await client.connect();

  const client = getRequestContext().env.XATA_CLIENT;

  const db = drizzle(client);
  // response all table name
  // Execute the SQL query to get all table names from the 'public' schema
  const tables = await db.execute(
    sql`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`
  );

  // In the edge runtime you can use Bindings that are available in your application
  // (for more details see:
  //    - https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/#use-bindings-in-your-nextjs-application
  //    - https://developers.cloudflare.com/pages/functions/bindings/
  // )
  //
  // KV Example:
  // const myKv = getRequestContext().env.MY_KV_NAMESPACE
  // await myKv.put('suffix', ' from a KV store!')
  // const suffix = await myKv.get('suffix')
  // responseText += suffix

  return new Response(JSON.stringify({ tables }), {
    headers: {
      "content-type": "application/json",
    },
  });
}
