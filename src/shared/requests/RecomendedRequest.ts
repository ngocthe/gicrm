import { BaseRequest } from "./BaseRequest";

class RecommendRequest extends BaseRequest {
  constructor() {
    super("/recommended-stores");
  }
}

export default new RecommendRequest();
