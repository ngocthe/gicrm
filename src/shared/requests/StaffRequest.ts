import { BaseRequest } from "../requests/BaseRequest";
import oFetchApi from "../../shared/composables/ofetchApi";

class StaffRequest extends BaseRequest {
  constructor() {
    super("/staffs");
  }

  async getAllStaffByStore<T>(store_id: number, key?: boolean) {
    return await oFetchApi<T>(this.resource, {
      params: {
        all: true,
        store_id,
      },
    });
  }
}

export default new StaffRequest();
