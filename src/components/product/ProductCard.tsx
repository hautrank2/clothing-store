"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Product } from "~/models/product";
import ColorBox from "../ui/color-box";
import { cn } from "~/lib/utils";

const ASSET_PREFIX = process.env.NEXT_PUBLIC_ASSET_PREFIX;
function ProductCard({ data }: { data: Product }) {
  const router = useRouter();
  const productByColor = data.colors;
  const [selectedVariant, setSelectedVariant] = useState<number>(0);
  const pColor = productByColor[selectedVariant];
  const [imgIndex, setImgIndex] = useState(0);

  return (
    <div className="product-card rounded-lg p-4 border border-transparent hover:border-muted-foreground">
      <div
        className="img w-full h-80 relative"
        onMouseEnter={() => setImgIndex(1)}
        onMouseLeave={() => setImgIndex(0)}
      >
        {pColor.imgUrls.map((imgUrl, index) => (
          <Image
            key={imgUrl}
            src={ASSET_PREFIX + imgUrl}
            alt="img-product"
            fill
            priority
            sizes="100%"
            className={cn(
              "mx-auto hover:cursor-pointer object-cover absolute",
              index === imgIndex ? "opacity-1" : "opacity-0"
            )}
            onClick={() =>
              router.push(
                `/product/${data.code}?${new URLSearchParams({
                  color: pColor.color,
                }).toString()}`
              )
            }
          />
        ))}
      </div>
      <div className="product-info my-2 space-y-4">
        <p className="mt-1">{`$${data.price}`}</p>
        <p className="font-semibold">{data.title}</p>
        <div className="flex product-colors gap-1">
          {productByColor.map((pColor, ix) => (
            <ColorBox
              key={pColor.hexCode + ix}
              color={pColor.hexCode}
              onClick={() => setSelectedVariant(ix)}
              className="h-6 w-6"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductCard;
