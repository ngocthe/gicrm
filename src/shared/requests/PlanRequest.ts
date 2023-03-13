import { BaseRequest } from "./BaseRequest";

class PlanRequest extends BaseRequest {
  constructor() {
    super("/plans");
  }
}

export default new PlanRequest();
