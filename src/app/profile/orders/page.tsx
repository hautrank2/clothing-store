"use client";

import React, { useMemo, useRef, useState } from "react";
import useSWR from "swr";
import { Badge } from "~/components/ui/badge";
import axiosClient from "~/lib/axios";
import { cn } from "~/lib/utils";
import { IOrder, ORDER_STATUS_VALUES } from "~/types/order";
import { formatDateTime } from "~/utils/datetime";
import { getUserData } from "~/utils/session";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import ItemCard from "~/components/product/ItemCard";
import { useStickyDetect } from "~/hooks/use-sticky-detect";
import SelectWrapper from "~/components/wrapper/select-wrapper";
import { Typography } from "~/components/ui/typography";

function OrdersPage({}) {
  const headerRef = useRef<HTMLDivElement>(null);
  const [filter, setFilter] = useState<string>("");
  const userData = getUserData(localStorage);
  const isSticky = useStickyDetect(headerRef, { topOffset: "0.5rem" });
  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/user/orders/${userData?._id}`,
    (url: string) => axiosClient.get(url).then((res) => res.data)
  );

  const displayData: IOrder[] = useMemo(() => {
    return (
      data?.filter((order: IOrder) => {
        return filter ? order.status === filter : true;
      }) || []
    );
  }, [data, filter]);

  return (
    <div>
      <div
        ref={headerRef}
        className={cn("sticky top-16", isSticky && "transition z-10 bg-background/90 p-2 dark")}
      >
        <div className="flex w-full justify-between items-center">
          <Typography variant={"h3"}>Orders</Typography>
          <div className="w-40">
            <SelectWrapper
              options={ORDER_STATUS_VALUES.map((e) => ({
                label: e,
                value: e,
              }))}
              onChange={setFilter}
              placeholder="Filter by status"
            />
          </div>
        </div>
      </div>
      {displayData.length > 0 ? (
        <ul className="flex flex-col mt-4 gap-4">
          {displayData?.map((order: IOrder, index: number) => {
            return (
              <li
                key={index}
                className={cn(
                  "flex flex-col gap-2 border rounded-lg p-4 shadow"
                )}
              >
                <div className="flex">
                  <p className="flex-[1] font-semibold">Created at</p>
                  <p className="flex-[4]">{formatDateTime(order.createdAt)}</p>
                </div>

                <div className="flex">
                  <p className="flex-[1] font-semibold">Updated</p>
                  <p className="flex-[4]">{formatDateTime(order.updatedAt)}</p>
                </div>

                <div className="flex">
                  <p className="flex-[1] font-semibold">Status</p>
                  <div className="flex-[4]">
                    <Badge>{order.status}</Badge>
                  </div>
                </div>

                <div className="flex">
                  <p className="flex-[1] font-semibold">Total price</p>
                  <p className="flex-[4]">${order.totalPrice}</p>
                </div>

                <Accordion type="single" collapsible className="w-full">
                  <AccordionItem value="item-1" className="border-b-0">
                    <AccordionTrigger className="justify-start gap-2 items">
                      <h4 className="mt-2">Products</h4>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="flex flex-col gap-2">
                        {order.items.map((item, index) => {
                          return (
                            <div
                              key={index}
                              className="border rounded shadow-sm"
                            >
                              <ItemCard item={item} />
                            </div>
                          );
                        })}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </li>
            );
          })}
        </ul>
      ) : (
        <Typography variant={"p"}>No data</Typography>
      )}
    </div>
  );
}

export default OrdersPage;
