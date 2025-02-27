import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { loadTypedefsFromFs } from "@repo/graphql";
import type { Resolvers } from "@repo/graphql/__generated__/graphql";
// for nodenext
import LocalitiesAPI from "./datasource.js";

interface AppContext {
  authenticationStatus: "pending" | "authenticated" | "unauthenticated";
  localitiesAPI: LocalitiesAPI;
}
const typeDefs = loadTypedefsFromFs();

const resolvers: Resolvers<AppContext> = {
  Query: {
    localities: async (_, { searchword, state }, { localitiesAPI }) => {
      return localitiesAPI.queryLocalities(searchword, state ?? undefined);
    },
  },
};
const server: ApolloServer<AppContext> = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server, {
  listen: { port: 4000 },
  context: async () => {
    const { cache } = server;
    return {
      authenticationStatus: "pending" as const,
      localitiesAPI: new LocalitiesAPI({ cache }),
    };
  },
}).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
