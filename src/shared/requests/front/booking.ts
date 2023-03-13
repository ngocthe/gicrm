import { BaseRequest } from "../../requests/BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";
import { IResponseData } from "~/../../src/shared/requests/types";
class BookingGuestRequest extends BaseRequest {
  constructor() {
    super("/guest/bookings");
  }

  async checkBooking<Payload>(params: object) {
    return await oFetchApi<Payload>(`${this.resource}/check-available`, {
      method: "POST",
      body: params,
    });
  }

  async listTimeRanger<Payload>(params: object) {
    return await oFetchApi<Payload>(`${this.resource}/times-available`, {
      method: "POST",
      body: params,
    });
  }

  async getStaffBooking<Payload>(params: object) {
    return await oFetchApi<Payload>(`${this.resource}/times-staff-available`, {
      method: "POST",
      body: params,
    });
  }
}

const bookingGuestRequest = new BookingGuestRequest();
export default bookingGuestRequest;
