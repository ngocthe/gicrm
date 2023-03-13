import { BaseRequest } from "~/../../src/shared/requests/BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";
import { Type } from "~~/../../src/store/models";

class TypeRequest extends BaseRequest {
  constructor() {
    super("/types");
  }
  async getAllType(type: string) {
    return await oFetchApi<Type[]>(`${this.resource}?all=true&model=${type}`);
  }
}

export default new TypeRequest();
