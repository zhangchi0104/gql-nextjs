import { readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const _dirname = dirname(__filename);
export * from "@repo/graphql/__generated__/graphql";

/**
 * Loads the GraphQL schema from the file system.
 * @param p - The path to the file, defaults to `packages/graphql/schema.graphql`.
 * @returns The content of the file.
 * @throws If the file does not exist.
 */
export const loadTypedefsFromFs = (p?: string): string => {
  const filePath = p ? p : join(_dirname, "schema.graphql");
  const content = readFileSync(filePath, { encoding: "utf-8" });
  return content;
};
