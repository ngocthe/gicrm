import { DataFile } from "../../shared/models/file";

export interface IAds {
  data: string;
  enable: number;
  id: number;
  image: DataFile;
  store_type: number;
  url: string;
}
