import { BaseRequest } from "./BaseRequest";

class QuestionCategoryRequest extends BaseRequest {
  constructor() {
    super("/frequently-question-categories");
  }
}

export default new QuestionCategoryRequest();
