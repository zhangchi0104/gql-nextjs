import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import "dotenv/config";
const __filename = fileURLToPath(import.meta.url);
const _dirname = dirname(__filename);
export * from "./__generated__/graphql.js";

/**
 * Loads the GraphQL schema from the file system.
 * @param p - The path to the file, defaults to `packages/graphql/schema.graphql`.
 * @returns The content of the file.
 * @throws If the file does not exist.
 */
export const loadTypedefsFromFs = (p?: string): string => {
  const filePath = p ? p : join(_dirname, "..", "schema.graphql");
  const content = readFileSync(filePath, { encoding: "utf-8" });
  return content;
};
