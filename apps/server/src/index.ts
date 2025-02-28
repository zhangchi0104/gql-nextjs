import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

import { loadTypedefsFromFs } from "@repo/graphql";
import type { Resolvers } from "@repo/graphql/__generated__/graphql-server";
// for nodenext
import LocalitiesAPI from "./datasource.js";
import { GraphQLError } from "graphql";

interface AppContext {
  authenticationStatus: "pending" | "authenticated" | "unauthenticated";
  localitiesAPI: LocalitiesAPI;
}
const typeDefs = loadTypedefsFromFs();

const resolvers: Resolvers<AppContext> = {
  Query: {
    // extending the original api by searching by the combination of suburb and postcode
    localities: async (_, { state, postcode, suburb }, { localitiesAPI }) => {
      if (!postcode && !suburb) {
        throw new GraphQLError("Must provide either postcode or suburb", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }
      if (postcode && suburb) {
        const localities = await localitiesAPI.queryLocalities(suburb);
        const filteredLocalities = localities.filter(
          // toString is safer than parseInt
          (locality) => locality.postcode.toString() === postcode,
        );

        return state
          ? filteredLocalities.filter((locality) => locality.state === state)
          : filteredLocalities;
      }
      // at this point we know that either postcode or suburb is provided
      // and that they are not both provided
      // so we can safely cast to string to make the type checker happy
      const searchword = postcode ?? (suburb as string);
      return localitiesAPI.queryLocalities(searchword, state ?? undefined);
    },
  },
};
export const server: ApolloServer<AppContext> = new ApolloServer({
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
