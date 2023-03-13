import type { Permission } from "~/../../src/shared/constants/permission";
import {
  ClosingTimes,
  ModelHasType,
  OpeningTimes,
  SettingStoreCancel,
  StoreManager,
  TagModel,
} from "~/src/admin/models";
import { ModelHasFile } from "~/src/shared/models";

export interface Role {
  name: string;
  permissions?: Permission[];
}

export interface StoreInterface {
  id: number;
  store_manager_id: number;
  name: string;
  first_company_name: string;
  last_company_name: string;
  first_company_name_kana: string;
  last_company_name_kana: string;
  introduction?: string;
  description?: string;
  news?: string;
  email: string;
  email_for_notification_reception: string;
  cancellation?: string;
  note?: string;
  phone_number: string;
  postal_code?: string;
  address?: string;
  address_detail?: string;
  home_page?: string;
  comment_opening_time?: string;
  transportation?: string;
  status: number;
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

export type User = {
  id: number;
  is_login_social: boolean;
  first_name?: string;
  last_name?: string;
  fullname?: string;
  fullname_kana?: string;
  first_name_kana?: string;
  last_name_kana?: string;
  email?: string;
  gender?: number;
  phone_number?: string;
  address?: string;
  address_detail?: string;
  postal_code?: string;
  birth_day?: string;
  social_type?: string;
  avatar: {
    id: number | null;
    url: string;
    file_type: string;
  } | null;
  role?: Role;
  store?: StoreInterface;
};
