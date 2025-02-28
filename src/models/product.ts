export type Color =
  | "black"
  | "white"
  | "red"
  | "blue"
  | "green"
  | "yellow"
  | "purple"
  | "orange"
  | "brown"
  | "gray";

export interface Product {
  _id: string;
  title: string;
  price: number;
  categoryId: string;
  description: string;
  variants: ProductVariant[]; // Danh sách biến thể sản phẩm (mỗi biến thể = màu + size + stock)
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductVariant {
  color: Color; // Màu sắc
  hexCode: string; // Mã màu HEX
  size: ProductSize; // Kích thước (S, M, L, XL)
  stock: number; // Số lượng trong kho
  images: string[]; // 2 ảnh cho từng màu
}

export type ProductSize = "S" | "M" | "L" | "XL" | "XXL" | "XXXL" | number;
