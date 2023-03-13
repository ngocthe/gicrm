import { BaseRequest } from "../requests/BaseRequest";

class FileRequest extends BaseRequest {
  constructor() {
    super("/files");
  }
}

export default new FileRequest();
