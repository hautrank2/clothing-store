import { GET } from "~/lib/axios";
import { Product } from "~/types/product";
import { PaginationResponse } from "~/types/query";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
export const productService = {
  getAll: async (params?: any): Promise<PaginationResponse<Product>> => {
    return GET<PaginationResponse<Product>>(`${API_ENDPOINT}/product`, {
      params,
    });
  },

  getByCode: async (code: string): Promise<Product> => {
    return GET<Product>(`${API_ENDPOINT}/product/${code}`);
  },

  getByCategoryCode: async (
    code: string,
    params?: any
  ): Promise<PaginationResponse<Product>> => {
    return GET<PaginationResponse<Product>>(
      `${API_ENDPOINT}/product/categoryCode/${code}`,
      { params }
    );
  },
};
