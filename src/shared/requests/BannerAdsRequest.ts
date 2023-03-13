import { BaseRequest } from "./BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";
class BannerAdsRequest extends BaseRequest {
  constructor() {
    super("/banners");
  }

  async getBannerIndex<T>(params?: object, key?: boolean) {
    return await oFetchApi<T>(`${this.resource}/index`, {
      method: "GET",
      params: params,
    });
  }
}

export default new BannerAdsRequest();
