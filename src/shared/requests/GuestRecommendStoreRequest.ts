import { BaseRequest } from "./BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";
import { IData } from "~/src/shared/requests/types";

class GuestRecommendStoreRequest extends BaseRequest {
  constructor() {
    super("/guest/recommended-stores");
  }
}

export default new GuestRecommendStoreRequest();
