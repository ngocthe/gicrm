import { BaseRequest } from "../requests/BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";

class StoreRequest extends BaseRequest {
  constructor() {
    super("/stores");
  }

  async getStatusBooking<T>(
    storeId: number,
    fromDate: string,
    toDate: string,
    targetTime: string,
    key?: boolean
  ) {
    return await oFetchApi<T>(`${this.resource}/${storeId}/status-booking?`, {
      params: {
        from_date: fromDate,
        to_date: toDate,
        time_target: targetTime,
      },
    });
  }

  async getReservationInDay<T>(storeId: number, day: string, key?: boolean) {
    return await oFetchApi<T>(
      `${this.resource}/${storeId}/reservations-in-day`,
      {
        params: {
          day: day,
        },
      }
    );
  }

  async getAvailableSeatInDay<T>(storeId: number, day: string, key?: boolean) {
    return await oFetchApi<T>(
      `${this.resource}/${storeId}/available-seat-in-day`,
      {
        params: {
          day: day,
        },
      }
    );
  }

  async getAvailableStaffInDay<T>(storeId: number, day: string, key?: boolean) {
    return await oFetchApi<T>(
      `${this.resource}/${storeId}/available-staff-in-day`,
      {
        params: {
          day: day,
        },
      }
    );
  }

  async getStepStore<T>(id: number, key?: boolean) {
    return await oFetchApi<T>(`${this.resource}/${id}/step-status`, {});
  }

  async checkStatusConnectZoom<T>() {
    return await oFetchApi<T>(`${this.resource}/check-zoom`, {});
  }

  async removeConnectZoom<T>() {
    return await oFetchApi<T>(`${this.resource}/remove-zoom`, {});
  }

  async generateZoomUrls<T>(params: any) {
    return await oFetchApi<T>(`${this.resource}/generate-zoom-urls`, {
      params: params,
    });
  }

  async settingPlan<T>(payload: object) {
    return await oFetchApi<T>(`${this.resource}/setting/plan`, {
      method: "PUT",
      body: payload,
    });
  }

  async getMaxImage<T>(id: number) {
    return await oFetchApi<T>(`${this.resource}/${id}/available-upload-image`, {
      method: "GET",
    });
  }
}

export default new StoreRequest();
