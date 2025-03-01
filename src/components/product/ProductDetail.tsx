"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { Product, ProductSize, ProductVariant } from "~/models/product";
import ColorBox from "../ui/color-box";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

function ProductDetail({ productData }: { productData: Product }) {
  const productByColor = getUniqueColors(productData.variants);
  const productBySize = getUniqueSizes(productData.variants);
  const [selectedImg, setSelectedImg] = useState<number>(0);
  const [selectedColor, setSelectedColor] = useState<string>(
    productByColor?.[0]?.color
  );
  const variant = productByColor.find((e) => e.color === selectedColor);
  const imgs = variant?.images || [];
  const [selectedSize, setSelectedSize] = useState<string>();

  const _variant = productData.variants.find(
    (item) => item.color === variant?.color && item.size == selectedSize
  );

  console.log(selectedSize, selectedColor, _variant);
  const valid = selectedSize && selectedColor && _variant && _variant.stock > 0;
  useEffect(() => {
    setSelectedImg(0);
  }, [selectedColor]);

  return (
    <div id="productDetail" className="grid grid-cols-2 gap-8">
      <div className="col-span-1">
        <div className="flex gap-4">
          <div className="img-list flex flex-col gap-4">
            {imgs.map((img, index) => {
              return (
                <div
                  key={img}
                  className={cn(
                    "border border-transparent",
                    index === selectedImg
                      ? "border-muted-foreground"
                      : "cursor-pointer hover:border-muted-foreground"
                  )}
                  onMouseOver={() => setSelectedImg(index)}
                >
                  <Image src={img} alt={img} width={200} height={200} />
                </div>
              );
            })}
          </div>
          <Image
            src={imgs[selectedImg]}
            alt={imgs[selectedImg]}
            width={400}
            height={400}
          />
        </div>
      </div>
      <div className="col-span-1">
        <h2>{productData.title}</h2>

        <section className="py-4">
          <h5 className="mb-2">Colour</h5>
          <div className="flex color gap-2">
            {productByColor.map((prod) => (
              <ColorBox
                key={prod.hexCode}
                color={prod.hexCode}
                onClick={() => setSelectedColor(prod.color)}
                active={selectedColor === prod.color}
              />
            ))}
          </div>
        </section>

        <section className="py-4">
          <h5 className="mb-2">Sizes</h5>
          <div className="flex color gap-2">
            <ToggleGroup
              type="single"
              variant={"outline"}
              onValueChange={(e) => setSelectedSize(e)}
            >
              {productBySize.map((prod) => (
                <ToggleGroupItem key={prod.size} value={prod.size.toString()}>
                  {prod.size}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          {
            <small
              className={selectedSize && selectedColor ? "block" : "opacity-0"}
            >{`${_variant?.stock || 0} products left`}</small>
          }
        </section>

        <section className="py-4">
          <Button disabled={!valid}>
            <Plus /> Add to Cart
          </Button>
        </section>
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

const getUniqueSizes = (variants: ProductVariant[]) => {
  const uniqueSizesMap = new Map<ProductSize, ProductVariant>();

  variants.forEach((variant) => {
    if (!uniqueSizesMap.has(variant.size)) {
      uniqueSizesMap.set(variant.size, {
        color: variant.color,
        hexCode: variant.hexCode,
        images: variant.images,
        size: variant.size,
        stock: 0,
      });
    }
  });

  return Array.from(uniqueSizesMap.values());
};

export default ProductDetail;
