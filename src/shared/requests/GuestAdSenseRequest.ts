import oFetchApi from "../composables/ofetchApi";
import { BaseRequest } from "./BaseRequest";

import { IAds } from "../../front/models";

class GuestAdSenseRequest extends BaseRequest {
  constructor() {
    super("guest/adsense");
  }

  /**
   *Get ads store
   * @returns
   */
  async getAdsStore(storeId?: number | null, storeTypeId?: number | null) {
    const result = await oFetchApi<IAds[]>(`${this.resource}`, {
      params: {
        store_id: storeId,
        store_type: storeTypeId,
      },
    });
    return result.data;
  }
}

export default new GuestAdSenseRequest();
