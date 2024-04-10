"use client";

import { toast } from "@lib/use-toast";
import { ToastAction } from "@ui/toast";
import { useEffect } from "react";

function PWALifeCycle() {
  useEffect(() => {
    if (
      typeof window !== "undefined" &&
      "serviceWorker" in navigator &&
      window.workbox !== undefined
    ) {
      const wb = window.workbox;

      wb.addEventListener("waiting", () => {
        toast({
          title: "Update is available!",
          description:
            "A newer version of this web app is available, reload to update?",
          action: (
            <ToastAction
              altText="Reload"
              onClick={() => {
                wb.messageSkipWaiting();
                wb.addEventListener("controlling", () => {
                  window.location.reload();
                });
              }}
            >
              Reload
            </ToastAction>
          ),
        });
      });

      wb.register();
    }
  }, []);

  return <></>;
}

export default PWALifeCycle;
