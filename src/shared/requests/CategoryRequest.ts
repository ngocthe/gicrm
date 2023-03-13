import { BaseRequest } from "../requests/BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";

class CategoryRequest extends BaseRequest {
  constructor() {
    super("/categories");
  }

  async getAllCategoryByStore<T>(store_id: number, key?: boolean) {
    return await oFetchApi<T>(this.resource, {
      params: {
        all: true,
        store_id,
      },
    });
  }
}

const categoryRequest = new CategoryRequest();
export default categoryRequest;
