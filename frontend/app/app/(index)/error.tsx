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
    <div className="-mx-6 -my-8 flex h-full grow flex-col items-center justify-center bg-destructive text-destructive-foreground">
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
