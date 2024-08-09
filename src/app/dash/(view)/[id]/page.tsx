import App from "@components/app/app";
import { api } from "@lib/trpc/server";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

async function Page({ params: { id } }: Props) {
  const [listExists, tasksResponse] = await Promise.all([
    api.list.getById({ id: id }),
    api.task.get({ listId: id }),
  ]);

  if (!listExists) notFound();

  return <App initialTasks={tasksResponse} listId={id} />;
}

export default Page;
