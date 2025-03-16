import useSWR, { BareFetcher, SWRResponse } from "swr";
import { DELETE, GET, PATCH, POST } from "~/lib/axios";
import { Product } from "~/models/product";
import useSWRMutation, { SWRMutationResponse } from "swr/mutation";
import { PaginationResponse } from "~/models/query";
import { z } from "zod";
import { hanldeProduct } from "~/utils/product";

export const productSizeSchema = z.union([
  z.enum(["S", "M", "L", "XL", "XXL", "XXXL"]),
  z.number(),
]);

export const productSchema = z.object({
  code: z.string().min(1, "Product Code is required"),
  title: z.string().min(1, "Product Name is required"),
  price: z.number().min(0, "Invalid price"),
  categoryId: z.string().min(1, "Please select a category"),
  description: z.string().optional(),
  colors: z
    .array(
      z.object({
        color: z.string(),
        hexCode: z.string(),
        sizes: z.array(
          z.object({
            size: z.string(),
            stock: z.number().min(0, "Stock must be at least 0"),
          })
        ),
      })
    )
    .nonempty("At least one color variant is required"),
});

export type ProductFormValues = z.infer<typeof productSchema>;

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

type GetResponse = PaginationResponse<Product>;

export const useProduct = (): SWRResponse => {
  const fetcher: BareFetcher<GetResponse> = (url: string) =>
    GET<GetResponse>(url);
  const swr = useSWR<GetResponse>(`${API_ENDPOINT}/product`, fetcher, {
    refreshInterval: 0,
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });
  return {
    ...swr,
    data: {
      ...swr.data,
      items: swr.data?.items.map(hanldeProduct) || [],
    },
  };
};

export const useProductByCode = ({ code }: { code: string }): SWRResponse => {
  const fetcher: BareFetcher<Product> = (url: string) => GET<Product>(url);
  const swr = useSWR<Product>(`${API_ENDPOINT}/product/${code}`, fetcher, {
    refreshInterval: 0,
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });
  return {
    ...swr,
    data: swr.data && hanldeProduct(swr.data),
  };
};

export const usePostProduct = (): SWRMutationResponse<
  ProductFormValues,
  any,
  string,
  ProductFormValues
> => {
  const fetcher = (url: string, { arg }: { arg: ProductFormValues }) =>
    POST<any>(url, arg);
  const swr = useSWRMutation(`${API_ENDPOINT}/product`, fetcher);
  return swr;
};

type ProductImgFormValues = {
  id: string;
  imgIndex: number;
  colorIndex: number;
  image: File;
};

export const usePostUploadProductImg = (): SWRMutationResponse<
  Product,
  any,
  string,
  ProductImgFormValues
> => {
  const fetcher = (url: string, { arg }: { arg: ProductImgFormValues }) => {
    const { id, image, ...rest } = arg;
    const params = new URLSearchParams(
      Object.fromEntries(
        Object.entries(rest).map(([key, value]) => [key, String(value)])
      )
    );
    return POST<any>(
      `${url}/${id}/uploadImg?${params.toString()}`,
      { image },
      { headers: { "Content-Type": "multipart/form-data" } }
    );
  };
  const swr = useSWRMutation(`${API_ENDPOINT}/product`, fetcher);
  return swr;
};

export const usePatchProduct = (): SWRMutationResponse<
  ProductFormValues,
  any,
  string,
  { id: string; body: ProductFormValues }
> => {
  const fetcher = (
    url: string,
    { arg }: { arg: { id: string; body: ProductFormValues } }
  ) => PATCH<any>(`${url}/${arg.id}`, arg.body);
  const swr = useSWRMutation(`${API_ENDPOINT}/product`, fetcher);
  return swr;
};

export const useDeleteProduct = (): SWRMutationResponse<
  ProductFormValues,
  any,
  string,
  string
> => {
  const fetcher = (url: string, { arg }: { arg: string }) =>
    DELETE<any>(`${url}/${arg}`);
  return useSWRMutation(`${API_ENDPOINT}/Product`, fetcher);
};
