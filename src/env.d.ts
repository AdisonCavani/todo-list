import type { Workbox } from "workbox-window";

declare global {
  interface Window {
    workbox: Workbox;
  }

  declare namespace NodeJS {
    interface ProcessEnv {
      DATABASE_CONNECTION_STRING: string;
    }
  }
}
