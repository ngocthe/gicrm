export interface DataFile {
  id?: number;
  url: string;
  file_type?: string;
}

export interface ImageUpload {
  id?: number;
  uid?: number;
  url?: string;
}

export interface ModelHasFile {
  file_id: string;
  model_id: number;
  file: DataFile;
}

export interface ListAllResponse {
  message: string;
  status_code: number;
  success: boolean;
  data: unknown | object;
}
