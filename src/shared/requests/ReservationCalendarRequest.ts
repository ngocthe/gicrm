import { BaseRequest } from "~/../../src/shared/requests/BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";

class ReservationCalendarRequest extends BaseRequest {
  constructor() {
    super("/bookings/calendars");
  }

  async fetchSalon<T>(fromDate: string, toDate: string, getAll = true) {
    return await oFetchApi<T[]>(`${this.resource}/salon`, {
      params: {
        from_date: fromDate,
        to_date: toDate,
        all: getAll,
      },
    });
  }

  async fetchRestaurant<T>(fromDate: string, toDate: string, getAll = true) {
    return await oFetchApi<T[]>(`${this.resource}/restaurant`, {
      params: {
        from_date: fromDate,
        to_date: toDate,
        all: getAll,
      },
    });
  }
}

export default new ReservationCalendarRequest();
