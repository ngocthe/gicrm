import { BaseRequest } from "../requests/BaseRequest";

class UserRequest extends BaseRequest {
  constructor() {
    super("/users");
  }
}

export default new UserRequest();
