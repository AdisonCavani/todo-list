import { IconStarFilled } from "@tabler/icons-react";

function Loading() {
  return (
    <>
      {/* Tasks & sort button */}
      <div className="mb-3 flex items-center justify-between">
        <div className="h-7 w-14 animate-pulse rounded-md bg-muted" />

        <div className="h-9 w-20 animate-pulse rounded-md bg-muted" />
      </div>

      {/* Sorted by... */}
      <div className="mb-2 flex items-center justify-end gap-x-3">
        <div className="h-6 w-52 animate-pulse rounded-md bg-muted" />
      </div>

      {/* Form component */}
      <div className="mb-3 h-24 rounded-md bg-secondary shadow-ms">
        {/* Top */}
        <div className="flex h-[52px] flex-row items-center gap-x-2 px-4">
          <div className="ml-[6px] min-h-[18px] min-w-[18px] animate-pulse rounded-full bg-muted" />

          {/* Input */}
          <div className="ml-4 h-4 w-20 animate-pulse rounded-full bg-muted px-4 py-2 outline-none" />
        </div>

        {/* Bottom */}
        <div className="flex h-11 items-center justify-between rounded-b-md border-t border-neutral-300 bg-neutral-50 px-4 dark:border-neutral-700 dark:bg-neutral-900/30">
          <div className="flex flex-row items-center gap-x-2">
            <div className="h-6 w-7 animate-pulse rounded-md bg-muted" />
            <div className="h-6 w-7 animate-pulse rounded-md bg-muted" />
            <div className="h-6 w-7 animate-pulse rounded-md bg-muted" />
          </div>

          {/* Add button */}
          <div className="h-8 w-[53px] animate-pulse rounded-md bg-muted px-3" />
        </div>
      </div>

      <ul className="flex flex-col gap-y-2">
        {[...Array(7).keys()].map((index) => (
          <li
            key={index}
            className="flex flex-row items-center gap-x-2 rounded-md bg-secondary px-4 shadow-ms"
          >
            <div className="ml-[6px] min-h-[18px] min-w-[18px] animate-pulse cursor-pointer appearance-none rounded-full bg-muted" />

            <div className="flex min-h-[52px] w-full flex-col justify-center px-4 py-2">
              <div className="h-4 w-48 animate-pulse rounded-full bg-muted" />
            </div>

            <div>
              <IconStarFilled size={18} className="animate-pulse text-muted" />
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}

export default Loading;
