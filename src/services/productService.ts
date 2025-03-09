import { GET } from "~/lib/axios";
import { Product } from "~/models/product";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
export const productService = {
  getAll: async (): Promise<Product[]> => {
    return GET(`${API_ENDPOINT}/product`);
  },

  getById: async (id: string): Promise<Product> => {
    return GET<Product>(`/product/${id}`);
  },
};
