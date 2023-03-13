import { BaseRequest } from "./BaseRequest";
import oFetchApi from "~/../../src/shared/composables/ofetchApi";
import { IListRankingInput, OrderBy, Period } from "../../front/models";
import { IResponseData } from "./types";
import { SORT_ORDER } from "../constants";

class RankingRequest extends BaseRequest {
  constructor() {
    super("/guest/rankings");
  }

  async getListRanking<T>(params?: IListRankingInput) {
    return await oFetchApi<IResponseData<T>>(`${this.resource}`, {
      params: {
        order_by: params?.order_by || OrderBy.access,
        direct: params?.direct || SORT_ORDER.DESC,
        period: params?.period || Period.day,
        type_store_id: params?.store_type_id || null,
      },
    });
  }
}

export default new RankingRequest();
