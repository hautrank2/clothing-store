import { GET } from "~/lib/axios";
import { Category, CategoryPopulate } from "~/models/category";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
export const categoryService = {
  getAllProducts: async (): Promise<Category[]> => {
    return GET(`${API_ENDPOINT}/category`);
  },

  getById: async (id: string): Promise<CategoryPopulate> => {
    return GET<CategoryPopulate>(`/category/${id}`);
  },
};
