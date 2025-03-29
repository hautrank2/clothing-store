import { z } from "zod";
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

export const itemSchema = z.object({
  product: z.string().min(1, "Product is required"),
  size: z.string().min(1, "Size is required"),
  color: z.string(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export type ItemFormValues = z.infer<typeof itemSchema>;
