import { DocumentManager } from "@y-sweet/sdk";

if (!process.env.Y_SWEET_CONNECTION_STRING) {
  throw new Error(
    "Y_SWEET_CONNECTION_STRING environment variable must be set in .env.local file. You can get a connection string by creating a Y-Sweet service at https://app.jamsocket.com",
  );
}

export const manager = new DocumentManager(
  process.env.Y_SWEET_CONNECTION_STRING,
);
