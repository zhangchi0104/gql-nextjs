import { readFileSync } from "node:fs";

import "dotenv/config";

export * from "./__generated__/graphql-server.js";

/**
 * Loads the GraphQL schema from the file system.
 * @param p - The path to the file, defaults to `packages/graphql/schema.graphql`.
 * @returns The content of the file.
 * @throws If the file does not exist.
 */
export const loadTypedefsFromFs = (p?: string): string => {
  const filePath = p ? p : "schema.graphql";
  const content = readFileSync(filePath, { encoding: "utf-8" });
  return content;
};
