export interface FilterStoreList {
  id: string | null;
  name: string | null;
  phone_number: string | null;
  email: string | null;
  type_store_id: number | null;
  plan_id: number | null;
  status: number | null;
}

export interface FilterBookingList {
  code: string;
  store_name: string;
  consumer_name: string;
  branch_type: number | null;
  status: number | null;
  start_date: string;
  end_date: string;
  consumer_id: number;
  consumer_type: string;
}

export interface FilterMessageList {
  start_date: string;
  end_date: string;
  key_search: string;
  sender: number | null;
  receiver: number | null;
}

export interface FilterBannerAdsList {
  name: string;
  position: number | null;
  status: number | null;
}

export interface FilterCustomerStoreList {
  keyword: string;
  number_visited_store_min: number;
  number_visited_store_max: number;
  month_start: string;
  month_end: string;
  day_start: string;
  day_end: string;
  year: string;
  gender: string;
  type_login: number | null;
  plan: number;
  title: string;
  start_date: string;
  due_date: string;
}

export interface FilterNoticeList {
  id: number;
  type: number;
  title: string;
  end_date: string;
  key_search: string;
}

export interface FilterRankingList {
  industry: number;
  type: number;
  store_name: string;
  genre_type: string;
  mode: number;
}

export interface FilterBookingList {
  code: string;
  store_name: string;
  consumer_name: string;
  branch_type: number | null;
  status: number | null;
  start_date: string;
  end_date: string;
}

export interface FilterNoticeList {
  id: number;
  type: number;
  title: string;
  end_date: string;
  key_search: string;
}

export interface SortStoreList {
  order_by: string;
  direct: string;
}

export interface FilterInvoicesList {
  id: number;
  reservation_code: string;
  start_date: string;
  payment_type: number;
  end_date: string;
  start_order_date: string;
  end_order_date: string;
}

export interface FilterCustomersList {
  id: number;
  email: string;
  fullname: string;
  phone_number: string;
  login_type: number;
  last_login: string;
  status: number;
  created_at: string;
}

export interface FilterRecommendList {
  store_name: string;
  plan_id: number | null;
  type_store_id: number | null;
  position: string;
}
