import type { NextRequest } from "next/server";
import { getRequestContext } from "@cloudflare/next-on-pages";
import { drizzle } from "drizzle-orm/d1";
import { sql } from "drizzle-orm";
// edge runtime
export const runtime = "edge";

export async function GET(request: NextRequest) {
  try {
    let responseText = "Hello World";
    const d1 = await getRequestContext().env.MY_DB;
    const db = drizzle(d1 as unknown as D1Database);
    // check that the database is connected
    const tables = await db.run(
      sql`SELECT * FROM sqlite_schema WHERE type='table' AND name NOT LIKE 'sqlite_%'`
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
  } catch (error) {
    return new Response(JSON.stringify({ error }), {
      headers: {
        "content-type": "application/json",
      },
    });
  }
}
