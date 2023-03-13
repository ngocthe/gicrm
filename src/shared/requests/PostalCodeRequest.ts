import { BaseRequest } from "../requests/BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";

class PostalCodeRequest extends BaseRequest {
  constructor() {
    super("/common/postal");
  }

  async getAddress<T>(params?: object) {
    return await oFetchApi<T>(`${this.resource}`, {
      method: "GET",
      params: params,
    });
  }
}

export default new PostalCodeRequest();
