"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import useSWR from "swr";
import { Checkbox } from "~/components/ui/checkbox";
import ColorBox from "~/components/ui/color-box";
import { Form } from "~/components/ui/form";
import { Skeleton } from "~/components/ui/skeleton";
import axiosClient from "~/lib/axios";
import { cn } from "~/lib/utils";
import { ICart, Item } from "~/types/cart";
import { orderFormSchema, OrderFormValues } from "~/types/order";
import { ProductColor } from "~/types/product";

type Props = {
  userId: string;
};

function CartForm({ userId }: Props) {
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      user: userId,
      items: [],
      shippingFee: 0,
      totalPrice: 0,
    },
  });

  const { getValues, setValue, watch, control } = form;
  const itemsFormArray = useFieldArray({
    control,
    name: "items",
  });
  const totalPrice = watch("totalPrice");
  const { fields: items } = itemsFormArray;

  const { data, isLoading, mutate } = useSWR<ICart>(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/user/cart/${userId}`,
    (url: string) => axiosClient(url).then((e) => e.data)
  );

  useEffect(() => {
    mutate();
  }, [mutate]);

  const onSubmit = (values: OrderFormValues) => {
    console.log("order submit", values);
  };

  const onChangeSelect = (index: number, newValue: boolean, item: Item) => {
    console.log("onChange");
    if (newValue) {
      itemsFormArray.append({
        ...item,
        product: item.product._id,
      });
    } else {
      itemsFormArray.remove(index);
    }

    calculateTotal();
  };

  const calculateTotal = () => {
    console.log(items);
    const total = items.reduce((acc, curr) => {
      const productData = data?.items.find(
        (item) => item.product._id === curr.product
      );
      return acc + curr.quantity * (productData?.product?.price ?? 0);
    }, 0);

    setValue("totalPrice", total);
  };

  return (
    <div className="relative">
      {isLoading ? (
        <div className="flex flex-col loading gap-4 gap-16">
          {Array.from({ length: 4 }, (_, i) => i).map((_, i) => {
            return (
              <div key={i} className="flex gap-8 h-20">
                <Skeleton className="w-24 h-24 rounded-full" />
                <div className="flex flex-[2] gap-2 flex-col">
                  <Skeleton className="w-full h-8 rounded-full" />
                  <Skeleton className="w-full h-8 rounded-full" />
                  <Skeleton className="w-full h-8 rounded-full" />
                </div>
              </div>
            );
          })}
        </div>
      ) : !data ? (
        <div className="mt-8">
          <h4>No items in your cart</h4>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div className="total container p-8 w-full rounded shadow-lg border fixed inset-x-0 bottom-2">
              <h3>Total: {totalPrice}</h3>
            </div>
            <ul className="flex flex-col gap-8">
              {data.items.map((item, index) => {
                const selectIndex = items.findIndex(
                  (i) =>
                    i.product === item.product._id &&
                    i.size === item.size &&
                    i.color === item.color
                );

                const isSelect = selectIndex !== -1;
                return (
                  <li
                    key={item.color + index}
                    className="shadow-lg border rounded"
                  >
                    <ItemCard
                      item={item}
                      select={isSelect}
                      onChangeSelect={() =>
                        onChangeSelect(selectIndex, !isSelect, item)
                      }
                    />
                  </li>
                );
              })}
            </ul>
          </form>
        </Form>
      )}
    </div>
  );
}

const ProductImgs = ({ pColor }: { pColor: ProductColor }) => {
  const [i, setI] = useState(0);
  return (
    <div
      className="w-full h-full relative"
      onMouseMove={() => setI(1)}
      onMouseLeave={() => setI(0)}
    >
      {pColor.imgUrls.map((imgUrl, ix) => {
        const img = process.env.NEXT_PUBLIC_ASSET_PREFIX + imgUrl;
        return (
          <Image
            key={img + ix}
            alt={img}
            src={img}
            fill
            sizes="100%"
            className={cn(i === ix ? "opacity-1" : "opacity-0")}
          />
        );
      })}
    </div>
  );
};

const ItemCard = ({
  item,
  select,
  onChangeSelect,
}: {
  item: Item;
  select: boolean;
  onChangeSelect: () => void;
}) => {
  const pColor = item.product.colors.find(
    (pColor) => pColor.color === item.color
  );
  return (
    <div className="flex">
      <div className="self-center px-8">
        <Checkbox
          className="w-10 h-10"
          checked={select}
          onCheckedChange={onChangeSelect}
        />
      </div>
      <div className="h-40 w-40">
        {pColor && <ProductImgs pColor={pColor} />}
      </div>
      <div className="flex-1 pt-2 px-4">
        <h4 className="font-semibold">{item.product.title}</h4>

        <div className="py-px flex border-border/80 border-b">
          <div className="flex-[1]">
            <p>Size:</p>
          </div>
          <div className="flex-[4]">
            <p>{item.size}</p>
          </div>
        </div>

        <div className="py-px flex border-border/80 border-b">
          <div className="flex-[1]">
            <p>Color:</p>
          </div>
          <div className="flex-[4] flex items-center gap-2">
            <p>{item.color}</p>
            <ColorBox color={pColor?.hexCode || ""} className="h-4 w-4" />
          </div>
        </div>

        <div className="py-px flex border-border/80 border-b">
          <div className="flex-[1]">
            <p>Quantity:</p>
          </div>
          <div className="flex-[4]">
            <p>{item.quantity}</p>
          </div>
        </div>

        <div className="py-px flex border-border/80 border-b">
          <div className="flex-[1]">
            <p>Price:</p>
          </div>
          <div className="flex-[4]">
            <p>
              <span className="font-bold">
                ${item.quantity * item.product.price}
              </span>{" "}
              ($
              {item.product.price}/item)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartForm;
