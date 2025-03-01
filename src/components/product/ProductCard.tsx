"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { Product, ProductVariant } from "~/models/product";
import ColorBox from "../ui/color-box";

function ProductCard({ data }: { data: Product }) {
  const router = useRouter();
  const productByColor = getUniqueColors(data.variants);
  const [selectedVariant, setSelectedVariant] = useState<number>(0);
  const variant = productByColor[selectedVariant];

  return (
    <div className="product-card rounded-lg p-4 border border-transparent hover:border-muted-foreground">
      <Image
        src={variant.images[0]}
        alt="img-product"
        objectFit="cover"
        width={300}
        height={300}
        className="mx-auto hover:cursor-pointer"
        onClick={() =>
          router.push(
            `/product/${data.code}?${new URLSearchParams({
              color: variant.color,
            }).toString()}`
          )
        }
      />
      <div className="product-info my-2">
        <p>{data.title}</p>
        <div className="flex product-colors gap-1">
          {productByColor.map((variant, ix) => (
            <ColorBox
              key={variant.hexCode + ix}
              color={variant.hexCode}
              onClick={() => setSelectedVariant(ix)}
            />
          ))}
        </div>
        <h5 className="mt-1">{`$${data.price}`}</h5>
      </div>
    </div>
  );
}

const getUniqueColors = (variants: ProductVariant[]) => {
  const uniqueColorsMap = new Map<string, ProductVariant>();

  variants.forEach((variant) => {
    if (!uniqueColorsMap.has(variant.color)) {
      uniqueColorsMap.set(variant.color, {
        color: variant.color,
        hexCode: variant.hexCode,
        images: variant.images,
        size: "XL", // Không cần size vì chỉ lấy thông tin màu
        stock: 0, // Không cần stock
      });
    }
  });

  return Array.from(uniqueColorsMap.values());
};

export default ProductCard;
