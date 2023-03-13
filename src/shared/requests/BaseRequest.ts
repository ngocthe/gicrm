import oFetchApi from "../../shared/composables/ofetchApi";
import { IData, IWrapPaginationData } from "./types";

export class BaseRequest {
  protected resource: string;

  constructor(resource: string) {
    this.resource = resource;
  }

  async list<T>(params?: object, key?: boolean) {
    return await oFetchApi<IData<T>>(this.resource, {
      method: "GET",
      query: params,
    });
  }

  /**
   * Get list data with response wrapped
   *
   * @param params
   * @returns
   */
  async getList<T>(params?: object) {
    return await oFetchApi<IWrapPaginationData<T>>(this.resource, {
      method: "GET",
      query: params,
    });
  }

  /**
   * Get all data with response wrapped
   *
   * @param params
   * @returns
   */
  async getAllData<T>(params?: object) {
    return await oFetchApi<T>(this.resource, {
      query: {
        ...params,
        all: true,
      },
    });
  }

  async show<T>(id: number, key?: boolean) {
    return await oFetchApi<T>(`${this.resource}/${id}`);
  }

  async post<T>(payload: object, key?: boolean) {
    return await oFetchApi<T>(`${this.resource}`, {
      method: "POST",
      body: payload,
    });
  }

  async put<T>(id: number, payload: object, key?: boolean) {
    return await oFetchApi<T>(`${this.resource}/${id}`, {
      method: "PUT",
      body: payload,
    });
  }

  async delete(id: number, key?: boolean) {
    return await oFetchApi(`${this.resource}/${id}`, {
      method: "DELETE",
    });
  }

  async export(params?: object, key?: boolean) {
    return oFetchApi(`${this.resource}/export-to-csv`, {
      method: "GET",
      params: params,
    });
  }

  async getDataDraft<T>(id: number, params?: object) {
    return await oFetchApi<T>(`${this.resource}/${id}`, {
      params: { draft: true },
    });
  }
}
