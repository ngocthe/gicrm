import { BaseRequest } from "../../requests/BaseRequest";

class HolidayRequest extends BaseRequest {
  constructor() {
    super("/holiday-japanese");
  }
}
const holidayRequest = new HolidayRequest();
export default holidayRequest;
