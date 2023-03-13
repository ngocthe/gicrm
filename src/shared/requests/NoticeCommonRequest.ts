import { BaseRequest } from "./BaseRequest";

class NoticeCommonRequest extends BaseRequest {
  constructor() {
    super("/common/notices");
  }
}

export default new NoticeCommonRequest();
