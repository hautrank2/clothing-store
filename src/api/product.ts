import useSWR, { BareFetcher, SWRResponse } from "swr";
import { DELETE, GET, PATCH, POST } from "~/lib/axios";
import { Product } from "~/models/product";
import useSWRMutation, { SWRMutationResponse } from "swr/mutation";
import { PaginationResponse } from "~/models/query";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export type ProductPayload = {
  image: File;
  code: string;
  title: string;
  parentId?: string | null;
};

type GetResponse = PaginationResponse<Product>;

export const useProduct = (): SWRResponse => {
  const fetcher: BareFetcher<GetResponse> = (url: string) =>
    GET<GetResponse>(url);
  const swr = useSWR<GetResponse>(`${API_ENDPOINT}/product`, fetcher, {
    refreshInterval: 0,
    revalidateIfStale: false,
    revalidateOnFocus: false,
  });
  return swr;
};

export const usePostProduct = (): SWRMutationResponse<
  ProductPayload,
  any,
  string,
  ProductPayload
> => {
  const fetcher = (url: string, { arg }: { arg: ProductPayload }) =>
    POST<any>(url, arg, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  const swr = useSWRMutation(`${API_ENDPOINT}/Product`, fetcher);
  return swr;
};

export const usePatchProduct = (): SWRMutationResponse<
  ProductPayload,
  any,
  string,
  { id: string; body: ProductPayload }
> => {
  const fetcher = (
    url: string,
    { arg }: { arg: { id: string; body: ProductPayload } }
  ) =>
    PATCH<any>(`${url}/${arg.id}`, arg.body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  const swr = useSWRMutation(`${API_ENDPOINT}/Product`, fetcher);
  return swr;
};

export const useDeleteProduct = (): SWRMutationResponse<
  ProductPayload,
  any,
  string,
  string
> => {
  const fetcher = (url: string, { arg }: { arg: string }) =>
    DELETE<any>(`${url}/${arg}`);
  return useSWRMutation(`${API_ENDPOINT}/Product`, fetcher);
};
