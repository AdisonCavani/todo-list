import { cn } from "@lib/utils";
import { IconExternalLink } from "@tabler/icons-react";
import { ComponentProps } from "react";

function ExternalLink({ children, className, ...props }: ComponentProps<"a">) {
  return (
    <a
      target="_blank"
      rel="noreferrer"
      className={cn(
        "inline-flex flex-row items-center gap-x-1 text-blue-600 hover:bg-gradient-to-r hover:from-blue-600 hover:to-blue-600 hover:bg-underline hover:bg-bottom hover:bg-no-repeat dark:text-blue-500",
        className
      )}
      {...props}
    >
      {children}
      <IconExternalLink size={14} />
    </a>
  );
}

export { ExternalLink };
