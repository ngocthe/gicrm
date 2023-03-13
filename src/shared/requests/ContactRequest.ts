import { BaseRequest } from "./BaseRequest";

class ContactRequest extends BaseRequest {
  constructor() {
    super("/common/contact");
  }
}

export default new ContactRequest();
