import { BaseRequest } from "../requests/BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";

class InvoiceRequest extends BaseRequest {
  constructor() {
    super("/invoices");
  }

  async showListInvoiceStore<T>(params?: object, key?: boolean) {
    return await oFetchApi<T>(`${this.resource}/v2`, {
      method: "GET",
      query: params,
    });
  }

  async exportV2(params?: object, key?: boolean) {
    return oFetchApi(`${this.resource}/v2/export-to-csv`, {
      method: "GET",
      params: params,
    });
  }
}

export default new InvoiceRequest();
