import { BaseRequest } from "./BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";

class NoticeRequest extends BaseRequest {
  constructor() {
    super("/notifications");
  }

  async seenNotice(id: number) {
    return await oFetchApi(`${this.resource}/${id}/seen`, {
      method: "GET",
    });
  }
}

export default new NoticeRequest();
