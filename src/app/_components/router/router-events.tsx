// Source: https://github.com/joulev/nextjs13-appdir-router-events
import { usePathname, useSearchParams } from "next/navigation";
import { configure, done, start } from "nprogress";
import { Suspense, useEffect } from "react";

configure({
  showSpinner: false,
});

export function onStart() {
  start();
}

export function onComplete() {
  done();
}

function useOnComplete() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  useEffect(() => onComplete(), [pathname, searchParams]);
}

function RouterEventsFn() {
  useOnComplete();
  return null;
}

/**
 * Using `useSearchParams` in SSG will cause the tree up to the closest `Suspense` to be client-side rendered.
 * You don't want that. Hence we need to wrap usage of `useOnComplete` inside `Suspense`. *Only* this
 * `__RouterEvents` component is client-side rendered, the rest is kept intact.
 *
 * However, if you don't use `useSearchParams` in `useOnComplete` above, you can simply import and use
 * `useOnComplete` in `app/layout.client.tsx` directly.
 */
export function RouterEvents() {
  return (
    <Suspense>
      <RouterEventsFn />
    </Suspense>
  );
}
