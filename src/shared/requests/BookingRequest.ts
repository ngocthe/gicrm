import { BaseRequest } from "../requests/BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";

class BookingRequest extends BaseRequest {
  constructor() {
    super("/bookings");
  }

  async getAll() {
    return await oFetchApi(`${this.resource}`);
  }

  async getTotalBooking<T>() {
    return await oFetchApi<T>(`${this.resource}/total-waitings`, {
      method: "GET",
    });
  }

  async getCategoryBooking<T>(params?: object, key?: boolean) {
    return await oFetchApi<T>(`${this.resource}/categories`, {
      method: "GET",
      params: params,
    });
  }

  async approveBooking<T>(id: number, key?: boolean) {
    return await oFetchApi<T>(`${this.resource}/approve/${id}`, {
      method: "PUT",
    });
  }

  async cancelBooking<T>(id: number, payload: object, key?: boolean) {
    return await oFetchApi<T>(`${this.resource}/cancel/${id}`, {
      method: "PUT",
      body: payload,
    });
  }

  async getFeeCancel<T>(id: number, key?: boolean) {
    return await oFetchApi<T>(`${this.resource}/fee-cancel/${id}`, {});
  }

  async visitedBooking<T>(id: number, payload?: object, key?: boolean) {
    return await oFetchApi<T>(`${this.resource}/visited/${id}`, {
      method: "PUT",
      body: payload,
    });
  }

  async getStaffBooking<T>(paramsUrl?: string, key?: boolean) {
    return await oFetchApi<T>(`${this.resource}/staffs?${paramsUrl}`, {});
  }

  async checkCouponCourse<T>(params?: object) {
    return await oFetchApi<T>(`${this.resource}/check-coupons`, {
      method: "GET",
      params: params,
    });
  }

  async refundBooking<T>(id: number, payload?: object) {
    return await oFetchApi<T>(`${this.resource}/retry-payment/${id}`, {
      method: "PUT",
      body: payload,
    });
  }
}

export default new BookingRequest();
