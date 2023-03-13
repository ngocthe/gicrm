import { ADMIN_PAGINATION } from "~/src/shared/constants";

export interface IData<T> {
  current_page: number;
  data: T;
  from: number;
  to: number;
  total: number;
  per_page: number;
  next_page_url?: string;
  prev_page_url?: string;
}

export interface IWrapPaginationData<T> {
  data: T;
  pagination: {
    current_page: number;
    from: number;
    to: number;
    total: number;
    per_page: number;
    next_page_url?: string;
    prev_page_url?: string;
  };
}

export interface IResponseData<T> {
  status_code: number;
  success: boolean;
  data: T;
  message?: string;
}

export type TokenResponse = {
  token: string;
};

export interface IResponseError {
  message: string;
  data: {
    errors: { [key: string]: string[] };
  };
}

export type ServerValidation = {
  [key: string]: string;
};

export type ServerError = {
  message: string;
  error?: Error;
};

export type LoginForm = {
  email: string;
  password: string;
  role_type: string;
};

export type ForgotPasswordForm = {
  email: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  birth_day: string;
};

export type ResetPasswordForm = {
  token: string;
  password: string;
  password_confirmation: string;
};

export type IResponseList<T> = {
  data: T;
  pagination: Pagination;
};

export interface Pagination {
  current_page: number;
  has_more_pages: boolean;
  last_page: number;
  per_page: number;
  total: number;
}

export interface PaginationForm {
  total: number;
  currentPage: number;
  numberRecordPerPage: number;
}
