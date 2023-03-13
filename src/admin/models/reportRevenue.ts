export interface ReportRevenue {
  id: number;
  type: number;
  store_name: string;
  store_code: string;
  total: number;
  fee: number;
  remain: number;
  payment_type: number;
  payment_status: string | number;
  date: string;
}
interface CourseBooking {
  id: number;
  name: string;
  price: number;
  price_children: number;
}

interface MenuBooking {
  id: number;
  name: string;
  price: number;
}

interface StaffBooking {
  id: number;
  name: string;
  fee: number;
  request_staff: number;
}

export interface BookingDetail {
  course: CourseBooking;
  menus: MenuBooking[];
  staff: StaffBooking;
}

export interface DetailReportRevenue {
  id: number;
  type: number;
  total: number;
  booking_fee: number;
  cancel_fee: number;
  reservation_id: number;
  reservation_code: string;
  number_adult: number;
  number_children: number;
  price_adult: number;
  price_children: number;
  store_id: number;
  children_price: number;
  store_name: string;
  store_image: string;
  course_name: string;
  course_price: string;
  email: string;
  name: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  line_fee: string;
  transaction_id: string;
  memo: string;
  total_people: number;
  payment_type: number;
  payment_status: number;
  order_time: string;
  visited_at: string;
  created_at: string;
  updated_at: string;
  cancel_memo: string;
  cancel_reason: string;
  paid_at: string;
  cancel_at: string;
  period: string;
  price: number;
  fee_per_person: number;
  amount: number;
  subscription_fee: number;
  booking_detail: BookingDetail;
  booking_type: number;
  detail: any;
  date: any;
}
