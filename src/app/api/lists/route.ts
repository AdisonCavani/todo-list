import { lists, type ListType } from "@db/schema";
import { db } from "@db/sql";
import { auth } from "@lib/auth";
import {
  createListRequestValidator,
  updateListRequestValidator,
} from "@lib/types";
import { and, eq } from "drizzle-orm";
import { v4 } from "uuid";
import { ZodError } from "zod";

async function POST(request: Request) {
  const session = await auth();

  if (!session) return new Response("Unauthorized", { status: 401 });

  try {
    const list = createListRequestValidator.parse(await request.json());

    const entity = {
      ...list,
      id: v4(),
      userId: session.user.id!,
    };

    await db.insert(lists).values(entity);

    const response: ListType = {
      ...entity,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return new Response(JSON.stringify(response), { status: 201 });
  } catch (error) {
    if (error instanceof ZodError)
      return new Response(JSON.stringify(error.errors), {
        status: 400,
      });

    return new Response("Internal server error", { status: 500 });
  }
}

async function PATCH(request: Request) {
  const session = await auth();

  if (!session) return new Response("Unauthorized", { status: 401 });

  try {
    const list = updateListRequestValidator.parse(await request.json());

    await db
      .update(lists)
      .set(list)
      .where(and(eq(lists.id, list.id), eq(lists.userId, session.user.id!)));

    const response: ListType = {
      ...list,
      userId: session.user.id!,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    return new Response(JSON.stringify(response), { status: 200 });
  } catch (error) {
    if (error instanceof ZodError)
      return new Response(JSON.stringify(error.errors), {
        status: 400,
      });

    return new Response("Internal server error", { status: 500 });
  }
}

export { POST, PATCH };
