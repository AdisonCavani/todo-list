import { cn } from "@lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@ui/avatar";
import { Button } from "@ui/button";
import { Input } from "@ui/input";
import type { ReactNode } from "react";

type Props = {
  type: "avatar" | "input";

  title: string;
  summary: string;
  hint: ReactNode;

  avatarSrc?: string;
  avatarFallback?: string;

  inputDisabled?: boolean;
  inputPlaceholder?: string;
  inputValue?: string;
};

function SettingsCard({
  type,
  title,
  summary,
  hint,
  avatarFallback,
  avatarSrc,
  inputDisabled,
  inputPlaceholder,
  inputValue,
}: Props) {
  return (
    <section className="w-full">
      <div
        className={cn(
          "flex w-full rounded-t-md border-x border-t p-6",
          type === "input"
            ? "flex-col"
            : "flex-row items-center justify-between"
        )}
      >
        <div>
          <h4 className="text-xl font-semibold">{title}</h4>
          <p className="my-3 text-sm">{summary}</p>
        </div>

        {type == "avatar" && (
          <Avatar className="h-20 w-20">
            <AvatarImage src={avatarSrc} alt="User avatar" />
            <AvatarFallback>{avatarFallback}</AvatarFallback>
          </Avatar>
        )}

        {type === "input" && (
          <Input
            disabled={inputDisabled}
            placeholder={inputPlaceholder}
            defaultValue={inputValue}
            className="max-w-xs"
          />
        )}
      </div>
      <div className="flex w-full items-center justify-between rounded-b-md border bg-secondary px-6 py-3">
        <p className="text-sm text-muted-foreground">{hint}</p>
        {!inputDisabled && <Button size="sm">Save</Button>}
      </div>
    </section>
  );
}

export default SettingsCard;
