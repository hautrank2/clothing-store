import Image from "next/image";
import React, { useState } from "react";
import { cn } from "~/lib/utils";
import { Item } from "~/types/cart";
import { ProductColor } from "~/types/product";
import ColorBox from "../ui/color-box";

function ItemCard({ item }: { item: Item }) {
  const data = {
    ...item,
    product: item.product,
  };

  const pColor = item.product.colors.find((p) => p.color === item.color);

  return (
    <div className="flex">
      <div className="h-40 w-40">
        {pColor && <ProductImgs pColor={pColor} />}
      </div>
      <div className="flex-1 pt-2 px-4 pb-2">
        <h4 className="font-semibold">{data.product.title}</h4>

        <div className="py-px flex gap-2 border-border/80 border-b items-center">
          <div className="flex-[1]">
            <p>Size:</p>
          </div>
          <div className="flex-[4]">
            <p>{data.size}</p>
          </div>
        </div>

        <div className="py-px flex gap-2 border-border/80 border-b items-center">
          <div className="flex-[1]">
            <p>Color:</p>
          </div>
          <div className="flex-[4] flex items-center gap-2">
            <p>{data.color}</p>
            <ColorBox color={pColor?.hexCode || ""} className="h-4 w-4" />
          </div>
        </div>

        <div className="py-px flex gap-2 border-border/80 border-b items-center">
          <div className="flex-[1]">
            <p>Quantity:</p>
          </div>
          <div className="flex-[4] py-2 flex items-center gap-4">
            <p>{data.quantity}</p>
          </div>
        </div>

        <div className="py-px flex gap-2 border-border/80 border-b items-center">
          <div className="flex-[1]">
            <p>Price:</p>
          </div>
          <div className="flex-[4]">
            <p>
              <span className="font-bold">
                ${data.quantity * data.product.price}
              </span>{" "}
              ($
              {data.product.price}/item)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ItemCard;

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
