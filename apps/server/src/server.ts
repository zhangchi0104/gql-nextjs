import { ApolloServer, BaseContext } from "@apollo/server";
import { Resolvers } from "@repo/graphql";
import { loadTypedefsFromFs } from "@repo/graphql";
import LocalitiesAPI from "./datasource.js";
import { GraphQLError } from "graphql";
import { verifyJwt } from "./auth.js";
import { startStandaloneServer } from "@apollo/server/standalone";
import {
  startServerAndCreateLambdaHandler,
  handlers,
} from "@as-integrations/aws-lambda";
interface AppContext extends BaseContext {
  authenticated: boolean;
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
            http: {
              status: 400,
            },
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
export const createApolloServer = () =>
  new ApolloServer({
    typeDefs,
    resolvers,
  });
export const createStandaloneServer = async ({
  port = 0,
}: {
  port?: number;
}) => {
  const server: ApolloServer<AppContext> = new ApolloServer({
    typeDefs,
    resolvers,
  });
  const { url } = await startStandaloneServer(server, {
    listen: { port },
    context: async ({ req }) => {
      const { cache } = server;
      const token = req.headers.authorization;
      if (!token || !token.startsWith("Bearer ")) {
        throw new GraphQLError("Unauthorized", {
          extensions: {
            code: "UNAUTHORIZED",
            http: {
              status: 401,
            },
          },
        });
      }

      const payload = await verifyJwt(token.slice(7));
      if (!payload) {
        throw new GraphQLError("Invalid token", {
          extensions: {
            code: "UNAUTHORIZED",
            http: {
              status: 401,
            },
          },
        });
      }
      return {
        authenticated: payload !== null,
        localitiesAPI: new LocalitiesAPI({ cache }),
      };
    },
  });
  return { url, server };
};

export const createLambdaHandler = async () => {};
