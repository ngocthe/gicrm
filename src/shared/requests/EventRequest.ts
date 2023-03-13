import { BaseRequest } from "../requests/BaseRequest";

class EventRequest extends BaseRequest {
  constructor() {
    super("/events");
  }
}

export default new EventRequest();
