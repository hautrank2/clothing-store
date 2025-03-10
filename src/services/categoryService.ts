import { GET } from "~/lib/axios";
import { Category } from "~/models/category";
import { PaginationResponse } from "~/models/query";

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
export const categoryService = {
  getAll: async (): Promise<PaginationResponse<Category>> => {
    return GET(`${ENDPOINT}/category`);
  },

  getById: async (id: string): Promise<Category> => {
    return GET<Category>(`${ENDPOINT}/category/${id}`);
  },
};
