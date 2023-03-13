export interface Ranking {
  id: number;
  plan: number;
  genre_type: number;
  evaluation_people: number;
  evaluation_score: number;
  sum_total_booking: number;
  sum_total_access: number;
  sum_real_booking: number;
  sum_real_access: number;
  real_booking: number;
  real_access: number;
  store_id: number;
  registered_person: string;
  ranking_registration_date: string;
  tentative_reservations: string;
  access_count: number;
  stores: Store;
}

export interface Store {
  update_user: object;
  admin_buff_store_ranking: StoreRanking;
}

export interface StoreRanking {
  daily_booking: string;
  daily_access: string;
  weekly_booking: string;
  weekly_access: string;
  monthly_booking: string;
  monthly_access: string;
}

export interface IPayloadGetListRanking {
  type_store_id: number | null;
  store_name: string | null;
  period: string;
  order_by: string;
  direct: string;
  tag_store_id: number[] | null;
  page: number;
  limit: number;
}
