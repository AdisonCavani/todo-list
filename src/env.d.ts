declare namespace NodeJS {
  interface ProcessEnv {
    NEXTAUTH_SECRET: string;
    DATABASE_CONNECTION_STRING: string;
  }
}
