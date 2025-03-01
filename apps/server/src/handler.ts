import { handlers } from "@as-integrations/aws-lambda";
import { startServerAndCreateLambdaHandler } from "@as-integrations/aws-lambda";

import { createApolloServer } from "./server.js";
import { GraphQLError } from "graphql";
import LocalitiesAPI from "./datasource.js";
import { verifyJwt } from "./auth.js";

const server = createApolloServer();
export const handler = startServerAndCreateLambdaHandler(
  // @ts-ignore
  server,
  // We will be using the Proxy V2 handler
  handlers.createAPIGatewayProxyEventV2RequestHandler(),
  {
    context: async ({ event, context }) => {
      const { cache } = server;
      const token = event.headers.authorization;
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
  },
);
