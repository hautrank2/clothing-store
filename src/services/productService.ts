import { GET } from "~/lib/axios";
import { Product } from "~/models/product";
import { PaginationResponse } from "~/models/query";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
export const productService = {
  getAll: async (): Promise<PaginationResponse<Product>> => {
    return GET<PaginationResponse<Product>>(`${API_ENDPOINT}/product`);
  },

  getById: async (id: string): Promise<Product> => {
    return GET<Product>(`${API_ENDPOINT}/product/${id}`);
  },
};
