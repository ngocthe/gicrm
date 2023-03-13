import { BaseRequest } from "~/../../src/shared/requests/BaseRequest";

class SubscriptionRequest extends BaseRequest {
  constructor() {
    super("/subscriptions");
  }
}

export default new SubscriptionRequest();
