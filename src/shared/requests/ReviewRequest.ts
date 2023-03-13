import { BaseRequest } from "../requests/BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";
class ReviewRequest extends BaseRequest {
  constructor() {
    super("/reviews");
  }

  async replyReview(id: number, payload: object) {
    return await oFetchApi(`${this.resource}/${id}/reply`, {
      method: "POST",
      body: payload,
    });
  }

  async editReplyReview(id: number, payload: object) {
    return await oFetchApi(`${this.resource}/${id}/reply`, {
      method: "PUT",
      body: payload,
    });
  }

  async readReview(id: number) {
    return await oFetchApi(`${this.resource}/${id}/read`, {
      method: "POST",
    });
  }
}

export default new ReviewRequest();
