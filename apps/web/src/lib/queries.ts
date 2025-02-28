import { gql } from "@repo/graphql/__generated__/client";

export const localitiesQuery = gql(/* GraphQL */ `
  query Locality($state: AustralianState, $postcode: String, $suburb: String) {
    localities(state: $state, postcode: $postcode, suburb: $suburb) {
      postcode
      location
      state
    }
  }
`);
