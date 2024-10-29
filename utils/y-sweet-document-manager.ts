import { DocumentManager } from "@y-sweet/sdk";

if (!process.env.Y_SWEET_CONNECTION_STRING) {
  throw new Error("Y_Sweet connection string not found");
}

export const manager = new DocumentManager(
  process.env.Y_SWEET_CONNECTION_STRING,
);
