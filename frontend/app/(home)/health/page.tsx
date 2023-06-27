import HealthCheckComponent from "@components/health/health-check";
import { mapToHealth } from "@lib/health";
import { IconCheck, IconExclamationMark } from "@tabler/icons-react";
import { Alert, AlertTitle } from "@ui/alert";

export const metadata = {
  title: "Health",
};

async function Page() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health`);
  const text = await res.text();

  const healthCheck = mapToHealth(
    "API Requests",
    "Requests for To-do list APIs",
    text.length > 0
      ? JSON.parse(text)
      : {
          status: "Unhealthy",
        }
  );

  return (
    <main className="mx-auto my-14 flex h-full w-full max-w-5xl grow flex-col gap-y-8 px-8">
      <Alert
        variant={
          healthCheck.status === "healthy"
            ? "success"
            : healthCheck.status === "degraded"
            ? "warning"
            : "destructive"
        }
      >
        {healthCheck.status === "healthy" ? (
          <IconCheck size={20} />
        ) : (
          <IconExclamationMark size={20} />
        )}
        <AlertTitle>
          {healthCheck.status === "healthy"
            ? "All Systems Operational"
            : "Incident with API Requests"}
        </AlertTitle>
      </Alert>

      <h3 className="text-2xl font-medium">Current status</h3>

      <section className="grid grid-cols-1 gap-px rounded border border-neutral-700 bg-neutral-700 sm:grid-cols-2">
        <HealthCheckComponent {...healthCheck} topLeft topRight />
        <HealthCheckComponent
          title="Website"
          description="Front-end of the To-do list app"
          status="healthy"
          message="Operational"
          bottomLeft
          bottomRight
        />
      </section>
    </main>
  );
}

export default Page;
