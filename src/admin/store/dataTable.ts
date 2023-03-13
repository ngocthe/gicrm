import { defineStore } from "pinia";
import {
  FilterStoreList,
  SortStoreList,
  FilterBookingList,
  FilterMessageList,
  FilterNoticeList,
  FilterInvoicesList,
  FilterCustomersList,
  FilterCustomerStoreList,
  FilterBannerAdsList,
  FilterRankingList,
  FilterRecommendList,
} from "~/../../src/admin/models";
import { ADMIN_PAGINATION } from "~/../../src/shared/constants";

interface DataTableState {
  storeList: {
    search: FilterStoreList | null;
    currentPage: number;
    pageSize: number;
    sort: SortStoreList | null;
  };
  bookingList: {
    search: FilterBookingList | null;
    currentPage: number;
    pageSize: number;
    sort: SortStoreList | null;
  };
  rankingList: {
    search: FilterRankingList | null;
    currentPage: number;
    pageSize: number;
    sort: SortStoreList | null;
  };
  noticeList: {
    search: FilterNoticeList | null;
    currentPage: number;
    pageSize: number;
    sort: SortStoreList | null;
  };
  invoiceList: {
    search: FilterInvoicesList | null;
    currentPage: number;
    pageSize: number;
    sort: SortStoreList | null;
  };
  customerList: {
    search: FilterCustomersList | null;
    currentPage: number;
    pageSize: number;
    sort: SortStoreList | null;
  };
  messageList: {
    search: FilterMessageList | null;
    currentPage: number;
    pageSize: number;
    sort: SortStoreList | null;
  };
  bannerAdsList: {
    search: FilterBannerAdsList | null;
    currentPage: number;
    pageSize: number;
    sort: SortStoreList | null;
  };
  customerStoreList: {
    search: FilterCustomerStoreList | null;
    currentPage: number;
    pageSize: number;
    sort: SortStoreList | null;
  };
  planList: {
    currentPage: number;
    pageSize: number;
    sort: SortStoreList | null;
  };
  RecommendTopList: {
    search: FilterRecommendList | null;
    currentPage: number;
    pageSize: number;
    sort: SortStoreList | null;
  };
  RecommendBottomList: {
    search: FilterRecommendList | null;
    currentPage: number;
    pageSize: number;
    sort: SortStoreList | null;
  };
}

export const DataTableStore = defineStore("dataTable", {
  state: () =>
    ({
      storeList: {
        search: null,
        currentPage: 1,
        pageSize: ADMIN_PAGINATION.PER_PAGE,
        sort: null,
      },
      rankingList: {
        search: null,
        currentPage: 1,
        pageSize: ADMIN_PAGINATION.PER_PAGE,
        sort: null,
      },
      bookingList: {
        search: null,
        currentPage: 1,
        pageSize: ADMIN_PAGINATION.PER_PAGE,
        sort: null,
      },
      noticeList: {
        search: null,
        currentPage: 1,
        pageSize: ADMIN_PAGINATION.PER_PAGE,
        sort: null,
      },
      messageList: {
        search: null,
        currentPage: 1,
        pageSize: ADMIN_PAGINATION.PER_PAGE,
        sort: null,
      },
      bannerAdsList: {
        search: null,
        currentPage: 1,
        pageSize: ADMIN_PAGINATION.PER_PAGE,
        sort: null,
      },
      invoiceList: {
        search: null,
        currentPage: 1,
        pageSize: ADMIN_PAGINATION.PER_PAGE,
        sort: null,
      },
      customerList: {
        search: null,
        currentPage: 1,
        pageSize: ADMIN_PAGINATION.PER_PAGE,
        sort: null,
      },
      customerStoreList: {
        search: null,
        currentPage: 1,
        pageSize: ADMIN_PAGINATION.PER_PAGE,
        sort: null,
      },
      saleList: {
        search: null,
        currentPage: 1,
        pageSize: ADMIN_PAGINATION.PER_PAGE,
        sort: null,
      },
      RecommendBottomList: {
        search: null,
        currentPage: 1,
        pageSize: ADMIN_PAGINATION.PER_PAGE,
        sort: null,
      },
      RecommendTopList: {
        search: null,
        currentPage: 1,
        pageSize: ADMIN_PAGINATION.PER_PAGE,
        sort: null,
      },
      planList: {
        currentPage: 1,
        pageSize: ADMIN_PAGINATION.PER_PAGE,
        sort: null,
      },
    } as DataTableState),
});
