import { BaseRequest } from "./BaseRequest";
class AdsenseRequest extends BaseRequest {
  constructor() {
    super("/adsense");
  }
}
export default new AdsenseRequest();
