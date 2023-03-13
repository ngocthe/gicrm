export interface Store {
  id?: number;
  store_manager_id?: number;
  name?: string;
  first_company_name?: string;
  last_company_name?: string;
  first_company_name_kana?: string;
  last_company_name_kana?: string;
  introduction?: string;
  description?: string;
  news?: string;
  cancellation?: string;
  note?: string;
  email?: string;
  phone_number?: string;
  postal_code?: string;
  address?: string;
  address_detail?: string;
  home_page?: string;
}

export interface Booking {
  id?: number;
  reservation_code?: string;
  order_name?: string;
  order_email?: string;
  order_phone_number?: string;
  order_memo?: string;
  status?: number;
  amount?: number;
  total_people?: number;
  payment_type?: number;
  status_payment?: number;
  created_at?: string;
  created_by?: number;
  updated_at?: string;
  updated_by?: number;
  deleted_at?: string | null;
  deleted_by?: string | null;
  store?: Store;
  cancel?: any;
}
