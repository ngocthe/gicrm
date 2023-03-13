import { BaseRequest } from "./BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";
import { IData } from "~/../../src/shared/requests/types";

class CommentRequest extends BaseRequest {
  constructor() {
    super("");
  }

  async postReview<T>(payload: object) {
    return await oFetchApi<T>(`${this.resource}/reviews`, {
      method: "POST",
      body: payload,
    });
  }

  async listReview<T>(params?: object) {
    return await oFetchApi<IData<T>>(`${this.resource}/guest/reviews`, {
      method: "GET",
      query: params,
    });
  }

  async checkReview<T>(storeId: number) {
    return await oFetchApi<IData<T>>(
      `${this.resource}/reviews/can-review/${storeId}`,
      {
        method: "GET",
      }
    );
  }

  async listMeReview<T>(params: object) {
    return await oFetchApi<IData<T>>(`${this.resource}/me/reviews`, {
      method: "GET",
      params: params,
    });
  }

  async listStoreReviews<T>(params?: object) {
    return await oFetchApi<IData<T>>(
      `${this.resource}/reviews/list-store-can-reviews`,
      {
        method: "GET",
        params: params,
      }
    );
  }
}

export default new CommentRequest();
