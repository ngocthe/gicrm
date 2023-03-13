import { BaseRequest } from "~/../../src/shared/requests/BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";

class TagRequest extends BaseRequest {
  constructor() {
    super("/tags");
  }
  async getAllType<T>(type?: string) {
    return await oFetchApi<T>(`${this.resource}?all=true&model=${type}`);
  }

  async getAllTagByStore<T>(typeStore?: number) {
    return await oFetchApi<T>(`/tags-store`, {
      params: { all: true, type_store_id: typeStore },
    });
  }
}

export default new TagRequest();
