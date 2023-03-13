import { BaseRequest } from "./BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";
import { IWrapPaginationData } from "./types";
import { IPayloadGetListRanking } from "../../admin/models/ranking";

class RankingRequest extends BaseRequest {
  constructor() {
    super("/rankings");
  }

  async getListRanking<T>(params?: IPayloadGetListRanking) {
    let customUrl = "?";
    let customQuery = null;

    if (params?.tag_store_id) {
      for (let i = 0; i < params.tag_store_id.length; i++) {
        if (i === params.tag_store_id.length - 1) {
          customUrl += `tag_store_id[]=${params.tag_store_id[i]}`;
        } else {
          customUrl += `tag_store_id[]=${params.tag_store_id[i]}&`;
        }
      }
      const { tag_store_id, ...otherQuery } = params;
      customQuery = { ...otherQuery };
    }

    return await oFetchApi<IWrapPaginationData<T>>(this.resource + customUrl, {
      method: "GET",
      query: customQuery ? customQuery : params,
    });
  }

  async updateRanking(payload: object) {
    return await oFetchApi(`${this.resource}/update`, {
      method: "PUT",
      body: payload,
    });
  }
}

export default new RankingRequest();
