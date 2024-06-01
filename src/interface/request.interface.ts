import { DataInterface } from "./data.interface";

export interface RequestInterface {
  method: string;
  data: DataInterface | string | number | any;
  key?: string;
}
