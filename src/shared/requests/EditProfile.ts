import { BaseRequest } from "../requests/BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";

class EditProfile extends BaseRequest {
  constructor() {
    super("/me");
  }

  async editProfile(payload: object) {
    return await oFetchApi(`${this.resource}`, {
      method: "PUT",
      body: payload,
    });
  }
}

export default new EditProfile();
