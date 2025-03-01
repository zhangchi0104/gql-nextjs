import { createStandaloneServer } from "./server.js";

createStandaloneServer({ port: 4000 }).then(({ url }) => {
  console.log(`🚀 Server ready at ${url}`);
});
