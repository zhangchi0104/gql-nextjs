import { RESTDataSource } from "@apollo/datasource-rest";
import {
  AustralianState,
  Locality,
} from "@repo/graphql/__generated__/graphql-server";
/**
 * The response from the REST API
 * only for internal use
 */
interface LocalitiesAPIResponse {
  localities:
    | {
        locality: Locality[] | Locality;
      }
    | "";
}
/**
 * The datasource for the localities API
 * Please note for simplicity, the data source will not validate the input
 * the responsibility of validating will be passed to the resolver
 */
class LocalitiesAPI extends RESTDataSource {
  override baseURL = process.env.LOCALITIES_API_URL;
  /**
   * Query the localities from the REST API
   * @param searchword - The search word
   * @param state - The state
   * @returns The localities
   */
  async queryLocalities(
    searchword: string,
    state?: AustralianState,
  ): Promise<Locality[]> {
    console.log("/GET /postcode/search.json");
    const response = await this.get<LocalitiesAPIResponse>(
      `/${process.env.LOCALITIES_API_STAGE ?? "staging"}/postcode/search.json`,
      {
        params: {
          q: searchword,
          state: state ?? undefined,
        },
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.LOCALITIES_API_KEY!}`,
        },
      },
    );
    if (response.localities === "") {
      return [];
    }
    // console.log("response.localities", response.localities);
    return Array.isArray(response.localities.locality)
      ? response.localities.locality
      : [response.localities.locality];
  }
}
export default LocalitiesAPI;
