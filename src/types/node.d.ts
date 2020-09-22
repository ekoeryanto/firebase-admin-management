declare namespace NodeJS {
  // Merge the existing `ProcessEnv` definition with ours
  // https://www.typescriptlang.org/docs/handbook/declaration-merging.html#merging-interfaces
  export interface ProcessEnv {
    NODE_ENV: "development" | "production" | "test";
    PORT: number;
    ADDRESS?: string;
    TRUSTPROXY?: string;
    COOKIE_SECRET?: string;
    FIREBASE_CLIENT_EMAIL: string;
    FIREBASE_PRIVATE_KEY: string;
    FIREBASE_PROJECT_ID: string;
    FIREBASE_APP_NAME: string;
    FIREBASE_CONFIG: string;
  }
}
