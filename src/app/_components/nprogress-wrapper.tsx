"use client";

import type { PropsWithChildren } from "react";
import { RouterEvents } from "./router/router-events";

function NProgressWrapper({ children }: PropsWithChildren) {
  return (
    <>
      {children}
      <RouterEvents />
    </>
  );
}

export default NProgressWrapper;
