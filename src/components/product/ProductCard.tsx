"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Product } from "~/models/product";
import ColorBox from "../ui/color-box";

const ASSET_PREFIX = process.env.NEXT_PUBLIC_ASSET_PREFIX;
function ProductCard({ data }: { data: Product }) {
  const router = useRouter();
  const productByColor = data.colors;
  const [selectedVariant, setSelectedVariant] = useState<number>(0);
  const pColor = productByColor[selectedVariant];

  return (
    <div className="product-card rounded-lg p-4 border border-transparent hover:border-muted-foreground">
      <Image
        src={ASSET_PREFIX + pColor.imgUrls[0]}
        alt="img-product"
        objectFit="cover"
        width={300}
        height={300}
        className="mx-auto hover:cursor-pointer"
        onClick={() =>
          router.push(
            `/product/${data.code}?${new URLSearchParams({
              color: pColor.color,
            }).toString()}`
          )
        }
      />
      <div className="product-info my-2">
        <p>{data.title}</p>
        <div className="flex product-colors gap-1">
          {productByColor.map((pColor, ix) => (
            <ColorBox
              key={pColor.hexCode + ix}
              color={pColor.hexCode}
              onClick={() => setSelectedVariant(ix)}
            />
          ))}
        </div>
        <h5 className="mt-1">{`$${data.price}`}</h5>
      </div>
    </div>
  );
}

export default ProductCard;
