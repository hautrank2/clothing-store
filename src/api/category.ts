import useSWR, { BareFetcher, SWRResponse } from "swr";
import { DELETE, GET, PATCH, POST } from "~/lib/axios";
import { Category } from "~/types/category";
import useSWRMutation, { SWRMutationResponse } from "swr/mutation";
import { PaginationResponse } from "~/types/query";

const API_ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;

export type CategoryPayload = {
  image: File;
  code: string;
  title: string;
  parentId?: string | null;
};

type GetResponse = PaginationResponse<Category>;

export const useCategory = (
  searchParams?: Record<string, any>,
  options?: Record<string, any>
): SWRResponse => {
  const fetcher: BareFetcher<GetResponse> = (url: string) =>
    GET<GetResponse>(url);
  const swr = useSWR<GetResponse>(
    `${API_ENDPOINT}/category` +
      (searchParams ? `?${new URLSearchParams(searchParams).toString()}` : ""),
    fetcher,
    {
      refreshInterval: 0,
      revalidateIfStale: false,
      revalidateOnFocus: false,
      ...(options || {}),
    }
  );
  return {
    ...swr,
    data: {
      ...swr.data,
      items:
        swr.data?.items.map((e: Category) => ({
          ...e,
          imgUrl: `${process.env.NEXT_PUBLIC_ASSET_PREFIX}/${e.imgUrl}`,
        })) || [],
    },
  };
};

export const usePostCategory = (): SWRMutationResponse<
  CategoryPayload,
  any,
  string,
  CategoryPayload
> => {
  const fetcher = (url: string, { arg }: { arg: CategoryPayload }) =>
    POST<any>(url, arg, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  const swr = useSWRMutation(`${API_ENDPOINT}/category`, fetcher);
  return swr;
};

export const usePatchCategory = (): SWRMutationResponse<
  CategoryPayload,
  any,
  string,
  { id: string; body: CategoryPayload }
> => {
  const fetcher = (
    url: string,
    { arg }: { arg: { id: string; body: CategoryPayload } }
  ) =>
    PATCH<any>(`${url}/${arg.id}`, arg.body, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  const swr = useSWRMutation(`${API_ENDPOINT}/category`, fetcher);
  return swr;
};

export const useDeleteCategory = (): SWRMutationResponse<
  CategoryPayload,
  any,
  string,
  string
> => {
  const fetcher = (url: string, { arg }: { arg: string }) =>
    DELETE<any>(`${url}/${arg}`);
  return useSWRMutation(`${API_ENDPOINT}/category`, fetcher);
};
