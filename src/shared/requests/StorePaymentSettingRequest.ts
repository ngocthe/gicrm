import { BaseRequest } from "~/../../src/shared/requests/BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";

class StorePaymentSettingRequest extends BaseRequest {
  constructor() {
    super("/stores/setting");
  }

  async postSettingPaymentCard<T>(payload: object, key?: boolean) {
    return await oFetchApi<T>(`${this.resource}/payment-card`, {
      method: "POST",
      body: payload,
    });
  }

  async getPaymentStatusStore<T>(key?: boolean) {
    return await oFetchApi<T>(`${this.resource}/payment-card`, {});
  }

  async deletePaymentCardStore<T>(key?: boolean) {
    return await oFetchApi<T>(`${this.resource}/payment-card`, {
      method: "DELETE",
    });
  }
}

export default new StorePaymentSettingRequest();
