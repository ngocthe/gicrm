import { BaseRequest } from "~/../../src/shared/requests/BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";

class CustomerEditRequest extends BaseRequest {
  constructor() {
    super("/customers");
  }

  async editCustomer<T>(id: number, payload: object) {
    return await oFetchApi<T>(`${this.resource}/customer/${id}`, {
      method: "PUT",
      body: payload,
    });
  }

  async editUser<T>(id: number, payload: object) {
    return await oFetchApi<T>(`${this.resource}/customer/${id}`, {
      method: "PUT",
      body: payload,
    });
  }
}

export default new CustomerEditRequest();
