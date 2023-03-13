import { TagModel } from "~/../../src/store/models/tag";

export interface StaffInterface {
  id: number;
  name: string;
  year_works?: string;
  fee?: number;
  info?: string;
  status?: boolean;
  positions?: [];
  image?: {
    file: object;
  };
  model_has_tag?: TagModel[];
  staff_opening_times?: [];
  staff_closing_times?: [];
  created_at: string;
  updated_at: string;
}
