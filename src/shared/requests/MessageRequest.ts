import { BaseRequest } from "../requests/BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";

class MessageRequest extends BaseRequest {
  constructor() {
    super("/messages");
  }

  async searchUser<Payload>(payload: object, key?: boolean) {
    return await oFetchApi(`${this.resource}/search-users`, {
      method: "POST",
      body: payload,
    });
  }

  async showRecipient<T>(id: number, params?: object, key?: boolean) {
    return await oFetchApi<T>(`${this.resource}/${id}/recipients`, {
      method: "GET",
      query: params,
    });
  }
}

export default new MessageRequest();
