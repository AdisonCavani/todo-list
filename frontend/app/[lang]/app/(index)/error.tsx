"use client";

import { Button } from "@ui/button";
import type Error from "next/error";

type Props = {
  error: Error;
  reset: () => void;
};

// TODO: replace this with proper Next.js type
function ErrorComponent({ reset }: Props) {
  return (
    <div className="-mx-3 -mb-24 -mt-8 flex h-full grow flex-col items-center justify-center bg-destructive p-4 text-destructive-foreground sm:-mx-6 sm:-mb-8">
      <p className="font-semibold">Oops!</p>
      <p>Something went wrong...</p>
      <Button
        variant="destructive"
        size="xs"
        className="mt-5"
        onClick={() => reset()}
      >
        Try again
      </Button>
    </div>
  );
}

export default ErrorComponent;
