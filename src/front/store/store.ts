import moment from "moment";
import { defineStore } from "pinia";
import { FilterStore } from "../models";
import { getCurrentTimeBooking } from "../../shared/utils";
import { useCookie } from "nuxt/app";
import { persistKeys } from "../../shared/constants/persist-key";
import { RESTAURANT, SALON } from "../../shared/constants/category";

interface UserStoreState {
  headerSearch: FilterStore;
  salon: FilterStore;
  restaurant: FilterStore;
  keyword_search_list_store_screen: string | null;
  time_list: string | null;
  min_price: string | null;
  max_price: string | null;
  date_list: string | null;
}

export const useStoreSearch = defineStore("storeSearch", {
  state: () =>
    ({
      headerSearch: {
        keyword_time: getCurrentTimeBooking(),
        keyword_date: moment().format("YYYY-MM-DD"),
        keyword_name: null,
        transportation: null,
      },
      salon: {
        keyword_time: getCurrentTimeBooking(),
        keyword_date: moment().format("YYYY-MM-DD"),
        keyword_name: null,
        transportation: null,
      },
      restaurant: {
        keyword_time: getCurrentTimeBooking(),
        keyword_date: moment().format("YYYY-MM-DD"),
        keyword_name: null,
        transportation: null,
      },
      keyword_search_list_store_screen: null,
      time_list: null,
      min_price: null,
      max_price: null,
      date_list: null,
    } as UserStoreState),
  actions: {
    /**
     * Handle reset header search
     */
    setHeaderSearch() {
      const menu = Number(useCookie(persistKeys.MENU).value);
      if (menu === SALON) {
        this.headerSearch = { ...this.salon };
      } else if (menu === RESTAURANT) {
        this.headerSearch = { ...this.restaurant };
      } else {
        // NOTE: Portal Site
        this.headerSearch.transportation = null;
        this.headerSearch.keyword_name = null;
        this.headerSearch.keyword_date = moment().format("YYYY-MM-DD");
        this.headerSearch.keyword_time = getCurrentTimeBooking();
      }
    },
    /**
     * Cache search with type of store
     */
    cacheSearch() {
      const menu = Number(useCookie(persistKeys.MENU).value);
      if (menu === SALON) {
        this.salon = { ...this.headerSearch };
      } else if (menu === RESTAURANT) {
        this.restaurant = { ...this.headerSearch };
      }
    },
  },
});
