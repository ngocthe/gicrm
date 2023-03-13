import { BaseRequest } from "../requests/BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";

class SeatRequest extends BaseRequest {
  constructor() {
    super("/seats");
  }
  async getAllByStore<T>(store_id: number, key?: boolean) {
    return await oFetchApi<T>(this.resource, {
      params: {
        all: true,
        store_id,
      },
    });
  }
}

const seatRequest = new SeatRequest();

export default seatRequest;
