declare namespace NodeJS {
  interface ProcessEnv {
    NEXTAUTH_SECRET: string;

    DATABASE_HOST: string;
    DATABASE_USERNAME: string;
    DATABASE_PASSWORD: string;

    DATABASE_CONNECTION_STRING: string;
  }
}
