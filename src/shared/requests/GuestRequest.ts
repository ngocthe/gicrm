import { BaseRequest } from "../requests/BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";

class GuestRequest extends BaseRequest {
  constructor() {
    super("/guest/stores");
  }

  async basicStore<T>(id: number, key?: boolean) {
    return await oFetchApi<T>(`${this.resource}/${id}/basic`, {});
  }

  async createStore<T>(payload: object, key?: boolean) {
    return await oFetchApi<T>(`${this.resource}`, {
      method: "POST",
      body: payload,
    });
  }
}

export default new GuestRequest();
