import type { Workbox } from "workbox-window";

declare global {
  interface Window {
    workbox: Workbox;
  }

  declare namespace NodeJS {
    interface ProcessEnv {
      AUTH_GITHUB_ID: string;
      AUTH_GITHUB_SECRET: string;
      AUTH_GOOGLE_ID: string;
      AUTH_GOOGLE_SECRET: string;
      DATABASE_CONNECTION_STRING: string;
    }
  }
}
