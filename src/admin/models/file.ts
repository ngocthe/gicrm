export interface DataFile {
  url: string;
  id: number;
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
