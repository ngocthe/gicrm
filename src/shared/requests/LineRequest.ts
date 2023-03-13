import { BaseRequest } from "../requests/BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";

class LineRequest extends BaseRequest {
  constructor() {
    super("/line");
  }

  async connection<Payload>(payload: object, key?: boolean) {
    return await oFetchApi<Payload>(`${this.resource}/connection`, {
      method: "POST",
      body: payload,
    });
  }

  async postLine<Payload>(payload: object, key?: boolean) {
    return await oFetchApi(`${this.resource}/store`, {
      method: "POST",
      body: payload,
    });
  }

  async showInfo<T>(key?: boolean) {
    return await oFetchApi<T>(`${this.resource}/info`, {});
  }

  async deleteLine(key?: boolean) {
    return await oFetchApi(`${this.resource}/delete`, {
      method: "DELETE",
    });
  }
}
const lineRequest = new LineRequest();

export default lineRequest;
