"use client";

import React from "react";
import TableWrapper from "~/components/wrapper/table-wrapper";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import useSWR, { mutate } from "swr";
import axiosClient from "~/lib/axios";
import { PaginationResponse } from "~/types/query";
import { IOrder, ORDER_STATUS_VALUES, OrderStatus } from "~/types/order";
import { IUser } from "~/types/user";
import { Address } from "~/types/address";
import { addressToString } from "~/components/address/AddressInfo";
import SelectWrapper from "~/components/wrapper/select-wrapper";
import useSWRMutation from "swr/mutation";

type Order = IOrder & {
  user: IUser;
};
function OrderPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || "1";
  const pageSize = searchParams.get("pageSize") || "10";
  const router = useRouter();
  const pathname = usePathname();
  const {
    data,
    mutate,
    isLoading: loading,
  } = useSWR<PaginationResponse<IOrder>>(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/order`,
    (url: string) =>
      axiosClient
        .get(`${url}?${new URLSearchParams({ page, pageSize }).toString()}`)
        .then((res) => res.data)
  );

  const { trigger } = useSWRMutation(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/order`,
    async (url: string, { arg }: { arg: { _id: string; status: string } }) => {
      const { _id, ...dto } = arg;
      const res = await axiosClient.patch(`${url}/${_id}`, dto);
      return res.data;
    }
  );

  return (
    <div className="mt-8">
      <TableWrapper
        className="mt-2"
        data={data ? data.items : []}
        loading={loading}
        pagination={
          data && {
            pageSize: data.pageSize,
            pageIndex: data.page,
            totalCount: data.total,
            totalPage: data.totalPage,
          }
        }
        onChangePage={(page) =>
          router.push(
            pathname +
              "?" +
              new URLSearchParams({ page: page.toString() }).toString()
          )
        }
        columns={[
          { title: "Created at", dataIndex: "createdAt", type: "datetime" },
          { title: "Updated at", dataIndex: "updatedAt", type: "datetime" },
          { title: "User", dataIndex: ["user", "name"] },
          {
            title: "Status",
            dataIndex: "status",
            render: (value, item: Order) => (
              <SelectWrapper
                size="sm"
                value={value}
                options={ORDER_STATUS_VALUES.map((e) => ({
                  value: e,
                  label: e,
                }))}
                onChange={(status: OrderStatus) => {
                  trigger({ _id: item._id, status });
                }}
              />
            ),
          },
          {
            title: "Address",
            dataIndex: "address",
            render: (value: Address) => <p>{addressToString(value)}</p>,
          },
        ]}
      />
    </div>
  );
}

export default OrderPage;
