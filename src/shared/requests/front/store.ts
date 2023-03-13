import { BaseRequest } from "../../requests/BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";
import { IResponseList } from "~/../../src/shared/requests/types";

class StoreGuestRequest extends BaseRequest {
  constructor() {
    super("/guest/stores");
  }

  async accessData<Payload>(id: number, key?: boolean) {
    return await oFetchApi<Payload>(`${this.resource}/access/${id}`, {
      method: "POST",
    });
  }

  async getImageStore<T>(id: number, params?: object, key?: boolean) {
    return await oFetchApi<IResponseList<T>>(`${this.resource}/images/${id}`, {
      method: "GET",
      params: params,
    });
  }

  async getCountImageStore<T>(id: number, key?: boolean) {
    return await oFetchApi<T>(`${this.resource}/count-images/${id}`, {});
  }
}
const storeGuestRequest = new StoreGuestRequest();
export default storeGuestRequest;
