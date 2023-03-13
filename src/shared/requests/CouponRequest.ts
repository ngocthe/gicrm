import { BaseRequest } from "~/../../src/shared/requests/BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";
import { IData } from "~/../../src/shared/requests/types";
import { RESTAURANT } from "~/../../src/shared/constants/category";

class CouponRequest extends BaseRequest {
  constructor() {
    super("/coupons");
  }

  async getListCouponCustom<T>(
    params?: object,
    applyItem?: Array<any>,
    typeStore?: number,
    key?: boolean
  ) {
    let customUrl = "";

    if (applyItem) {
      if (typeStore === RESTAURANT) {
        customUrl = applyItem.map((item) => `apply_course[]=${item}`).join("&");
      } else {
        customUrl = applyItem.map((item) => `apply_event[]=${item}`).join("&");
      }
    }

    return await oFetchApi<IData<T>>(this.resource + "?" + customUrl, {
      method: "GET",
      query: params,
    });
  }
}

export default new CouponRequest();
