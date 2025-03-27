"use client";

import { Plus } from "lucide-react";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import ColorBox from "~/components/ui/color-box";
import axiosClient from "~/lib/axios";
import { cn } from "~/lib/utils";
import { ICart, Item } from "~/types/cart";
import { ProductColor } from "~/types/product";

type Props = {
  userId: string;
};
function CartForm({ userId }: Props) {
  const { data, isLoading, mutate } = useSWR<ICart>(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/user/cart/${userId}`,
    (url: string) => axiosClient(url).then((e) => e.data)
  );

  useEffect(() => {
    mutate();
  }, [mutate]);

  return (
    <div>
      {/* {true && (
        <div className="flex flex-col loading gap-4">
          {Array.from({ length: 20 }, (_, i) => i).map((_, i) => {
            return <Skeleton key={i} className="w-full h-20" />;
          })}
        </div>
      )} */}

      {!data ? (
        <div>No data</div>
      ) : (
        data.items.map((item, index) => {
          return (
            <div key={item.color + index} className="shadow-lg border rounded">
              <ItemCard item={item} />
            </div>
          );
        })
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

const ItemCard = ({ item }: { item: Item }) => {
  const pColor = item.product.colors.find(
    (pColor) => pColor.color === item.color
  );
  return (
    <div className="flex">
      <div className="self-center px-8">
        <Checkbox className="w-10 h-10" />
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
