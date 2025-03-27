import { Product } from "./product";
import { IUser } from "./user";

export interface Item {
  product: Product;
  size: string;
  color: string;
  quantity: number;
}

export interface ICart {
  _id: string;
  user: IUser;
  items: Item[];
  isCheckedOut: boolean;
}
