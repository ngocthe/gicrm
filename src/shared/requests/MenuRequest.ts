import { BaseRequest } from "../requests/BaseRequest";

class MenuRequest extends BaseRequest {
  constructor() {
    super("/menus");
  }
}
const menuRequest = new MenuRequest();

export default menuRequest;
