declare namespace NodeJS {
  interface ProcessEnv {
    NEXTAUTH_SECRET: string;

    AUTH_GITHUB_ID: string;
    AUTH_GITHUB_SECRET: string;

    AUTH_GOOGLE_ID: string;
    AUTH_GOOGLE_SECRET: string;

    DATABASE_HOST: string;
    DATABASE_USERNAME: string;
    DATABASE_PASSWORD: string;

    DATABASE_CONNECTION_STRING: string;
  }
}
