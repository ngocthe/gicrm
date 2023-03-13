import { ModelHasType, TagModel } from "~/../../src/admin/models";
import { ModelHasFile } from "~/../../src/shared/models";

export interface StoreInterface {
  id: number;
  code: number;
  store_manager_id: number;
  name: string;
  first_company_name: string;
  last_company_name: string;
  first_company_name_kana: string;
  last_company_name_kana: string;
  introduction: string | null;
  description: string | null;
  news: string | null;
  email: string;
  email_for_notification_reception: string;
  cancellation: string | null;
  note: string | null;
  phone_number: string;
  postal_code: string | null;
  address: string | null;
  address_detail: string | null;
  home_page: string | null;
  comment_opening_time: string | null;
  transportation: string | null;
  is_setting_cancel: boolean;
  status: number;
  status_display: boolean;
  portal_site: boolean;
  store_manager?: StoreManager;
  model_has_type?: ModelHasType;
  model_has_file: ModelHasFile[];
  model_has_tag?: TagModel[];
  opening_times: OpeningTimes[];
  closing_times: ClosingTimes[];
  setting_store_cancel: SettingStoreCancel;
  created_at: string;
  updated_at: string;
}

export interface StoreManager {
  id: null;
  first_name: string;
  last_name: string;
}

export interface OpeningTimes {
  id: number;
  store_id: number;
  day_of_week: number;
  start: string;
  end: string;
}

export interface ClosingTimes {
  day_off: string;
}

export interface SettingStoreCancel {
  no_contact_money: string;
  no_contact_percent: string;
  one_day_ago_money: string;
  one_day_ago_percent: string;
  seven_day_to_two_day_ago_money: string;
  seven_day_to_two_day_ago_percent: string;
  that_day_money: string;
  that_day_percent: string;
}
