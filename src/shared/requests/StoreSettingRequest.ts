import { BaseRequest } from "./BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";

class StoreSettingRequest extends BaseRequest {
  constructor() {
    super("/stores/setting");
  }

  async checkLineAvailable<Payload>(payload: object, key?: boolean) {
    return await oFetchApi<Payload>(`${this.resource}/line/available`, {
      method: "POST",
      body: payload,
    });
  }

  async saveLineSetting<Payload>(payload: object, key?: boolean) {
    return await oFetchApi(`${this.resource}/line`, {
      method: "POST",
      body: payload,
    });
  }

  async getLineSetting<T>(key?: boolean) {
    return await oFetchApi<T>(`${this.resource}/line`, {});
  }

  async deleteLineSetting(key?: boolean) {
    return await oFetchApi(`${this.resource}/line`, {
      method: "DELETE",
    });
  }

  async checkHotPepperAvailable<Payload>(payload: object) {
    return await oFetchApi<Payload>(`${this.resource}/hotpepper/available`, {
      method: "POST",
      body: payload,
    });
  }

  async saveHotPepperSetting<Payload>(payload: object) {
    return await oFetchApi<Payload>(`${this.resource}/hotpepper`, {
      method: "POST",
      body: payload,
    });
  }

  async getHotPepperSetting<T>() {
    return await oFetchApi<T>(`${this.resource}/hotpepper`, {});
  }

  async deleteHotPepperSetting() {
    return await oFetchApi(`${this.resource}/hotpepper`, {
      method: "DELETE",
    });
  }

  async checkHotPepperBeautyAvailable<Payload>(payload: object) {
    return await oFetchApi<Payload>(
      `${this.resource}/hotpepper-beauty/available`,
      {
        method: "POST",
        body: payload,
      }
    );
  }

  async saveHotPepperBeautySetting<Payload>(payload: object) {
    return await oFetchApi<Payload>(`${this.resource}/hotpepper-beauty`, {
      method: "POST",
      body: payload,
    });
  }

  async getHotPepperBeautySetting<T>() {
    return await oFetchApi<T>(`${this.resource}/hotpepper-beauty`, {});
  }

  async deleteHotPepperBeautySetting() {
    return await oFetchApi(`${this.resource}/hotpepper-beauty`, {
      method: "DELETE",
    });
  }

  async checkGoogleAvailable<Payload>(payload: object) {
    return await oFetchApi<Payload>(`${this.resource}/google/available`, {
      method: "POST",
      body: payload,
    });
  }

  async saveGoogleSetting<Payload>(payload: object) {
    return await oFetchApi<Payload>(`${this.resource}/google`, {
      method: "POST",
      body: payload,
    });
  }

  async getGoogleSetting<T>() {
    return await oFetchApi<T>(`${this.resource}/google`, {});
  }

  async deleteGoogleSetting() {
    return await oFetchApi(`${this.resource}/google`, {
      method: "DELETE",
    });
  }

  async checkTabelogAvailable<Payload>(payload: object) {
    return await oFetchApi<Payload>(`${this.resource}/tabelog/available`, {
      method: "POST",
      body: payload,
    });
  }

  async saveTabelogSetting<Payload>(payload: object) {
    return await oFetchApi<Payload>(`${this.resource}/tabelog`, {
      method: "POST",
      body: payload,
    });
  }

  async getTabelogSetting<T>() {
    return await oFetchApi<T>(`${this.resource}/tabelog`, {});
  }

  async deleteTabelogSetting() {
    return await oFetchApi(`${this.resource}/tabelog`, {
      method: "DELETE",
    });
  }

  async checkGurunaviAvailable<Payload>(payload: object) {
    return await oFetchApi<Payload>(`${this.resource}/gurunavi/available`, {
      method: "POST",
      body: payload,
    });
  }

  async saveGurunaviSetting<Payload>(payload: object) {
    return await oFetchApi<Payload>(`${this.resource}/gurunavi`, {
      method: "POST",
      body: payload,
    });
  }

  async getGurunaviSetting<T>() {
    return await oFetchApi<T>(`${this.resource}/gurunavi`, {});
  }

  async deleteGurunaviSetting() {
    return await oFetchApi(`${this.resource}/gurunavi`, {
      method: "DELETE",
    });
  }
}

const storeSettingRequest = new StoreSettingRequest();

export default storeSettingRequest;
