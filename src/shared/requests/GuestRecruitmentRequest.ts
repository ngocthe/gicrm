import { BaseRequest } from "../requests/BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";
import { IData } from "~/src/shared/requests/types";

class GuestRecruitmentRequest extends BaseRequest {
  constructor() {
    super("guest/recruitments");
  }
  async getGuestRecruitment<T>(id: number) {
    return await oFetchApi<IData<T>>(`${this.resource}/store/${id}`, {});
  }

  async applyRecruitment(id: number, payload: object) {
    return await oFetchApi(`${this.resource}/${id}/apply`, {
      method: "POST",
      body: payload,
    });
  }
}

export default new GuestRecruitmentRequest();
