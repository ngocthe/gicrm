import { StoreInterface } from "~/../../src/admin/models/store";

export interface BookingDetail {
  id: number;
  order_time: string;
  order_email: string;
  order_first_name: string;
  order_last_name: string;
  order_memo: string;
  order_name?: string;
  order_phone_number: string;
  store: StoreInterface;
  store_id: number;
  detail: DetailInterface;
  status: number;
  status_payment: number;
  visited_at?: string;
  type_user_create?: number;
  amount: number;
  amount_discount: number;
}

export interface DetailInterface {
  course: {
    id: number;
    name: string;
    payment_type: number;
  };
  course_id: number;
  id: number;
  number_adult: number;
  number_children?: number;
  price_adult: number;
  price_children: number;
  seat_type_id: number;
  payment_status: number;
}
