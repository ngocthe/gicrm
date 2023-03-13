export interface Message {
  id?: number;
  title?: string;
  body?: string;
  delivery_count: object;
  type?: number;
  recipients?: Recipient[];
  status?: number;
  start_date?: string;
  due_date?: string;
  created_at?: string;
  created_by?: number;
  updated_at?: string;
  updated_by?: number;
  deleted_at?: string | null;
  deleted_by?: string | null;
}

export interface ListMessage {
  data: Message;
  pagination: object;
}

export interface Recipient {
  id?: number;
  first_name: string;
  last_name?: string;
  fullname?: string;
  first_name_kana?: string;
  last_name_kana?: string;
  fullname_kana: string;
  email: string;
  phone_number: string;
}
