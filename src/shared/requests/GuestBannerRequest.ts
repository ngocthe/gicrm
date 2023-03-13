import oFetchApi from "../composables/ofetchApi";
import { BaseRequest } from "../requests/BaseRequest";

import { BannerAds } from "../../front/models";

class GuestBannerRequest extends BaseRequest {
  constructor() {
    super("guest/banners");
  }

  /**
   * Get Ads for guest users and customer
   *
   * @return BannerAds[]
   */
  async getAds(typeStoreId?: number | string | null) {
    const result = await oFetchApi<BannerAds[]>(`${this.resource}`, {
      params: { store_type: typeStoreId },
    });
    return result.data;
  }
}

export default new GuestBannerRequest();
