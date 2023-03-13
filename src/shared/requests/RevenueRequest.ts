import { BaseRequest } from "../requests/BaseRequest";

class RevenueRequest extends BaseRequest {
  constructor() {
    super("/reservation");
  }
}

export default new RevenueRequest();
//TODO
