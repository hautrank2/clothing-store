import { z } from "zod";

export enum AddressType {
  HOME = "home",
  OFFICE = "office",
}

export interface Address {
  country: string;
  city: string;
  district: string;
  street: string;
  zipCode?: string;
  type: AddressType;
}

export const addressSchema = z.object({
  street: z.string().min(1, "Street is required"),
  city: z.string().min(1, "City is required"),
  district: z.string().min(1, "District is required"),
  postalCode: z.string().min(1, "Postal code is required"),
  country: z.string().min(1, "Country is required"),
  type: z.enum(["home", "office"], { message: "Type is home or office" }),
});

export type AddressFormValues = z.infer<typeof addressSchema>;
