import { BaseRequest } from "../requests/BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";

class PaymentRequest extends BaseRequest {
  constructor() {
    super("/payments");
  }

  async setting<T>() {
    return await oFetchApi<T>(`${this.resource}/settings`);
  }

  async applySetting<T>(payload: object) {
    return await oFetchApi<T>(`${this.resource}/settings`, {
      method: "POST",
      body: payload,
    });
  }

  async checkConnect<Payload>(payload: object) {
    return await oFetchApi(`${this.resource}/connects`, {
      method: "POST",
      body: payload,
    });
  }

  async getToken<T>(storeId: number) {
    return await oFetchApi<T>(`${this.resource}/token/${storeId}`);
  }

  async getTokenPayment<T>(id: number, key?: boolean) {
    return await oFetchApi<T>(`${this.resource}/${id}`, {});
  }
}
export default new PaymentRequest();
