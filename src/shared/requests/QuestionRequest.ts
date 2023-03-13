import { BaseRequest } from "./BaseRequest";

class QuestionRequest extends BaseRequest {
  constructor() {
    super("/frequently-questions");
  }
}

export default new QuestionRequest();
