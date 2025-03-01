import type { CodegenConfig } from "@graphql-codegen/cli";

const config: CodegenConfig = {
  overwrite: true,
  schema: "./schema.graphql",
  documents: ["./src/**/*.{ts,tsx}", "../../apps/web/src/**/*.{ts,tsx}"],
  generates: {
    "src/__generated__/graphql-server.ts": {
      plugins: ["typescript", "typescript-resolvers"],
    },
    "src/__generated__/client/": {
      preset: "client",

      presetConfig: {
        gqlTagName: "gql",
      },
    },
  },
  ignoreNoDocuments: true,
};

export default config;
