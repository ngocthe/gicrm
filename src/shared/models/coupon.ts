export interface CouponInterface {
  id: number;
  name: string;
  code: string;
  apply_all?: number;
  description?: string;
  discount_money?: number;
  discount_percent?: number;
  end_date?: string;
  infinite_quantity?: number;
  quantity?: number;
  start_date?: string;
  status: number;
  store_id: number;
}
