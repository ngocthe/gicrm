import { BaseRequest } from "./BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";

class RecruitmentRequest extends BaseRequest {
  constructor() {
    super("/recruitments");
  }

  reOrderIndex = async (id: number, newIndex: number) => {
    return await oFetchApi(this.resource + `/${id}/reorder/${newIndex}`, {
      method: "PUT",
    });
  };
}

export default new RecruitmentRequest();
