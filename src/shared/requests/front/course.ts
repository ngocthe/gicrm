import { BaseRequest } from "../../requests/BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";
import { ACTIVE } from "~/../../src/shared/constants";

class CourseRequest extends BaseRequest {
  constructor() {
    super("/guest/courses");
  }

  async getAllCourseByStore<T>(store_id: number, key?: boolean) {
    return await oFetchApi<T>(this.resource, {
      params: {
        all: true,
        status: ACTIVE,
        store_id,
      },
    });
  }
}
const courseRequest = new CourseRequest();
export default courseRequest;
