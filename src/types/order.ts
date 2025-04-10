import { z } from "zod";
import { Item, itemSchema } from "./cart";
import { addressSchema } from "./address";

export enum OrderStatus {
  PENDING = "pending",
  CONFIRMED = "confirmed",
  SHIPPED = "shipped",
  DELIVERED = "delivered",
  CANCELLED = "cancelled",
}

export const ORDER_STATUS_VALUES = Object.values(OrderStatus);

export const orderFormSchema = z.object({
  user: z.string().min(1, "User ID is required"),
  items: z.array(itemSchema).min(1, "At least one item is required"),
  shippingFee: z.number().min(0, "Shipping fee is required"),
  totalPrice: z.number().min(0, "Total price is required"),
  address: addressSchema,
  phone: z.string().min(9, "Phone is required"),
  status: z
    .enum(["pending", "confirmed", "shipping", "completed", "canceled"])
    .optional(),
  paymentId: z.string().optional(),
  deliveredAt: z.date().optional(),
});

export type OrderFormValues = z.infer<typeof orderFormSchema>;

export type IOrder = Omit<z.infer<typeof orderFormSchema>, "items"> & {
  _id: string;
  createdAt: string;
  updatedAt: string;
  items: Item[]; // Ghi đè kiểu items
};
