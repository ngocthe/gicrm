export interface Plan {
  id: number;
  name: string;
  duration: number;
  priority: number;
  recommend_portal_site_priority: number;
  initial_cost: number;
  monthly_cost_annual: number;
  monthly_cost: number;
  card_payment_fee: number;
  monthly_booking: number;
  number_staff: number;
  number_store_top_photo: number;
  number_photo: number;
  number_customer: number;
  job_offer: number;
  advertisement: number;
  support: number;
  booking_fee_setting: number;
  zoom_fee: number;
  line_fee: number;
  external_site_monthly_fee: number;
  customer_attraction_fee: number;
  initial_support_monthly_fee: number;
  submission_agency_monthly_fee: number;
  sms_monthly_fee: number;
  custom_billing_monthly_fee: number;
}

export interface StorePlan {
  id: number;
  store_id: number;
  plan_id: number;
  plan_data: Plan;
  extend_type: number;
  start_date: string;
  due_date: string | null;
}
