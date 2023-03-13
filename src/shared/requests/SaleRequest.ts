import { BaseRequest } from "../requests/BaseRequest";

class SaleRequest extends BaseRequest {
  constructor() {
    super("/sales");
  }
}

export default new SaleRequest();
