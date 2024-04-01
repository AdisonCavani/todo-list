"use client";

import NextLink from "next/link";
import { forwardRef, type ComponentProps, type MouseEvent } from "react";
import { onStart } from "./router-events";

// https://github.com/vercel/next.js/blob/400ccf7b1c802c94127d8d8e0d5e9bdf9aab270c/packages/next/src/client/link.tsx#L169
function isModifiedEvent(event: MouseEvent): boolean {
  const eventTarget = event.currentTarget as HTMLAnchorElement | SVGAElement;
  const target = eventTarget.getAttribute("target");
  return (
    (target && target !== "_self") ||
    event.metaKey ||
    event.ctrlKey ||
    event.shiftKey ||
    event.altKey || // triggers resource download
    (event.nativeEvent && event.nativeEvent.which === 2)
  );
}

const Link = forwardRef<HTMLAnchorElement, ComponentProps<typeof NextLink>>(
  ({ href, onClick, ...props }, ref) => {
    return (
      <NextLink
        href={href}
        onClick={(event) => {
          if (!isModifiedEvent(event)) {
            const { pathname, search, hash } = window.location;
            if (href !== pathname + search + hash) onStart();
          }
          if (onClick) onClick(event);
        }}
        {...props}
        ref={ref}
      />
    );
  },
);

Link.displayName = "Link";

export default Link;
