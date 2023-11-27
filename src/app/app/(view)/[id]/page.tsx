import App from "@components/app/app";
import { tasks } from "@db/schema";
import { db } from "@db/sql";
import { auth } from "@lib/auth";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

async function Page({ params: { id } }: Props) {
  const session = await auth();

  const [listExists, tasksResponse] = await Promise.all([
    db.query.lists.findFirst({
      where: (list, { and, eq }) =>
        and(eq(list.id, id), eq(list.userId, session!.user.id)),
    }),
    db.select().from(tasks).where(eq(tasks.listId, id)),
  ]);

  if (!listExists) notFound();

  return <App initialTasks={tasksResponse} listId={id} />;
}

export default Page;
