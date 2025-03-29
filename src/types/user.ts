import { Address } from "./address";

export interface IUser {
  _id?: string; // optional if it's used before MongoDB inserts
  username: string;
  email?: string;
  password: string;
  phone?: string;
  isValidPhone?: boolean;
  name?: string;
  role: RoleType;
  isActive: boolean;
  address?: Address[];
  emailOrPhone?: string; // Used for validation logic, not stored in DB
  createdAt?: Date;
  updatedAt?: Date;
}

export enum RoleType {
  ADMIN = "admin",
  CUSTOMER = "customer",
}
