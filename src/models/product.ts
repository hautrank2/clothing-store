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

export type ProductSize = "S" | "M" | "L" | "XL" | "XXL" | "XXXL" | number;

export interface ProductSizeStock {
  size: ProductSize; // Kích thước có thể là chữ hoặc số
  stock: number; // Số lượng tồn kho
}

export interface ProductColor {
  color: Color; // Màu sắc
  hexCode: string; // Mã màu HEX
  imgUrls: string[]; // 2 ảnh cho từng màu
  sizes: ProductSizeStock[]; // Danh sách size và stock
}

export interface Product {
  _id: string;
  code: string;
  title: string;
  price: number;
  categoryId: string;
  description: string;
  colors: ProductColor[]; // Danh sách biến thể theo màu sắc (chứa size bên trong)
  createdAt: Date;
  updatedAt: Date;
}
