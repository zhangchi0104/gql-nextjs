import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { loadTypedefsFromFs } from "@repo/graphql";
import type { Resolvers } from "@repo/graphql";
interface AppContext {
  authenticationStatus: "pending" | "authenticated" | "unauthenticated";
}
const typeDefs = loadTypedefsFromFs();

const resolvers: Resolvers<AppContext> = {
  Query: {
    localities: () => {
      return {
        localities: [],
      };
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
    return {
      authenticationStatus: "pending" as const,
    };
  },
}).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
