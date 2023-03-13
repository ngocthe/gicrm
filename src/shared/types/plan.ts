export interface Plan {
  name: string;
  duration: number;
  monthly_cost_annual: number;
  initial_cost: number;
  monthly_cost: number;
  card_payment_fee: number;
  monthly_booking: number;
  number_staff: number;
  number_store_top_photo: number;
  number_photo: number;
  number_customer: number;
  number_registered_customers: number;
  job_offer: number;
  advertisement: number;
  support: number;
  zoom_fee: number;
  line_fee: number;
  external_site_monthly_fee: number;
  submission_agency_monthly_fee: number;
  sms_monthly_fee: {
    below_100: number;
    below_300: number;
    below_500: number;
    below_1000: number;
    unlimit: number;
  };
  custom_billing_monthly_fee: number;
  initial_support_monthly_fee: number;
  customer_attraction_fee: number;
  booking_fee_setting: any;
}
