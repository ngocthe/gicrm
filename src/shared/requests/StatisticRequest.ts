import { BaseRequest } from "../requests/BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";

class StatisticRequest extends BaseRequest {
  constructor() {
    super("/statistic");
  }

  async getIncome<T>(params: object, key?: boolean) {
    return await oFetchApi<T>(`${this.resource}/income`, {
      method: "GET",
      params: params,
    });
  }

  async exportIncome(params?: object, key?: boolean) {
    return await oFetchApi(`${this.resource}/income/export-to-csv`, {
      method: "GET",
      params: params,
    });
  }

  async getBooking<T>(params: object, key?: boolean) {
    return await oFetchApi<T>(`${this.resource}/booking`, {
      method: "GET",
      params: params,
    });
  }

  async exportBooking(params?: object, key?: boolean) {
    return await oFetchApi(`${this.resource}/booking/export-to-csv`, {
      method: "GET",
      params: params,
    });
  }

  async getBookingSource<T>(params: object, key?: boolean) {
    return await oFetchApi<T>(`${this.resource}/booking-source`, {
      method: "GET",
      params: params,
    });
  }

  async exportBookingSource(params?: object, key?: boolean) {
    return await oFetchApi(`${this.resource}/booking-source/export-to-csv`, {
      method: "GET",
      params: params,
    });
  }
}

export default new StatisticRequest();
