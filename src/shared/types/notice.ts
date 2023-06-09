export interface Notice {
  id?: number;
  title?: string;
  body?: string;
  type?: number;
  seen_status?: number;
  creator_image?: string;
  unseen_notification?: number;
  book_url?: string;
  shop_booking_url?: string;
  booking_url?: string;
  store_image?: string;
  actor?: object;
  site_name?: string;
  number_child?: string;
  fee_cancel?: string;
  shop_book_confirm_url?: string;
  booking_date_time?: string;
  booking_content?: string;
  referer?: object;
  status?: number;
  total?: number;
  current_page?: number;
  per_page?: number;
  start_date?: string;
  due_date?: string;
  created_at?: string;
  created_by?: number;
  updated_at?: string;
  updated_by?: number;
  deleted_at?: string | null;
  deleted_by?: string | null;
}
