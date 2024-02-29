import { auth } from "@lib/auth";
import { lists, tasks } from "@server/db/schema";
import { db } from "@server/db/sql";
import { and, eq } from "drizzle-orm";

async function DELETE(
  _: Request,
  { params: { id } }: { params: { id: string } },
) {
  const session = await auth();

  if (!session) return new Response("Unauthorized", { status: 401 });

  const [listsResponse, __] = await Promise.all([
    db
      .delete(lists)
      .where(and(eq(lists.id, id), eq(lists.userId, session.user.id!))),

    db.delete(tasks).where(eq(tasks.listId, id)),
  ]);

  if (listsResponse.rowsAffected > 0)
    return new Response(null, { status: 204 });

  return new Response(null, { status: 404 });
}

export { DELETE };
