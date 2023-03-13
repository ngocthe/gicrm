import { BaseRequest } from "../requests/BaseRequest";

class RegisterStoreRequest extends BaseRequest {
  constructor() {
    super("/form-register-stores");
  }
}

export default new RegisterStoreRequest();
