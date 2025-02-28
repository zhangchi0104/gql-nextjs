"use server";
import { ApolloClient, createHttpLink, InMemoryCache } from "@apollo/client";

import { AustralianState } from "@repo/graphql";
import { gql } from "@repo/graphql/__generated__/client";
export const createServerSideClient = async () => {
  console.log("apollo server url", process.env.APOLLO_SERVER_URL);
  const link = createHttpLink({
    uri: process.env.APOLLO_SERVER_URL!,
  });
  const client = new ApolloClient({
    link,
    cache: new InMemoryCache(),
  });
  return client;
};
const localitiesQuery = gql(/* GraphQL */ `
  query Locality($searchWord: String!, $state: AustralianState) {
    localities(searchword: $searchWord, state: $state) {
      postcode
      location
      state
    }
  }
`);

interface LocalityVerificationResult {
  status: "ok" | "error";
  message: string;
}

export async function queryLocalities(
  searchWord: string,
  state?: AustralianState,
) {
  const client = await createServerSideClient();
  const { data } = await client.query({
    query: localitiesQuery,
    variables: { searchWord, state },
  });
  return data.localities;
}

export async function validateLocality(
  state: AustralianState,
  suburb: string,
  postcode: string,
): Promise<LocalityVerificationResult> {
  const localities = await queryLocalities(postcode.toString(), state);
  const locality = localities.find(
    (l) => l.location.toLowerCase() === suburb.toLowerCase(),
  );
  if (!locality) {
    return {
      status: "error",
      message: `postcode ${postcode} doesnot match the suburb ${suburb}`,
    };
  }
  if (locality.state !== state) {
    return {
      status: "error",
      message: `Suburb ${suburb} does not exist in ${state}`,
    };
  }
  return {
    status: "ok",
    message: "the postcode, suburb, and state input are valid",
  };
}
