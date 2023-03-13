import { BaseRequest } from "./BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";

class CustomerRequest extends BaseRequest {
  constructor() {
    super("/v2/customers");
  }

  async importFile<Payload>(payload: object, key?: boolean) {
    return await oFetchApi(`${this.resource}/imports`, {
      method: "POST",
      body: payload,
    });
  }

  async exportCustomer(params?: object) {
    return oFetchApi(`${this.resource}/template`, {
      method: "GET",
      params: params,
    });
  }

  async showDetailCustomer<T>(id: number, key?: boolean) {
    return await oFetchApi<T>(`${this.resource}/${id}/customer`, {});
  }

  async showDetailUser<T>(id: number, key?: boolean) {
    return await oFetchApi<T>(`${this.resource}/${id}/user`, {});
  }
}

export default new CustomerRequest();
