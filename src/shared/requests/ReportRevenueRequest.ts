import { BaseRequest } from "../requests/BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";
import { IResponseList } from "~/../../src/shared/requests/types";

class ReportRevenueRequest extends BaseRequest {
  constructor() {
    super("/reports/revenue");
  }

  async listRevenue<T>(params?: object, key?: boolean) {
    return await oFetchApi<IResponseList<T>>(this.resource, {
      method: "GET",
      params: params,
    });
  }
}

export default new ReportRevenueRequest();
