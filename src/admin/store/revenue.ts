import { defineStore } from "pinia";
import { SortStoreList } from "~/../../src/admin/models";
import { ADMIN_PAGINATION } from "~/../../src/shared/constants";

interface DataRevenueState {
  mode: null;
  start: null;
  end: null;
  store_name: null;
  store_code: string | null;
  payment_status: null;
  type: string | null;
  currentPage: number;
  pageSize: number;
  sort: SortStoreList;
}

export const DataRevenueStore = defineStore("dataRevenue", {
  state: () =>
    ({
      mode: null,
      start: null,
      end: null,
      store_name: null,
      store_code: null,
      payment_status: null,
      currentPage: 1,
      pageSize: ADMIN_PAGINATION.PER_PAGE,
      type: null,
      sort: null,
    } as DataRevenueState),
});
