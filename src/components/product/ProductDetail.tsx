"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { Product } from "~/types/product";
import ColorBox from "../ui/color-box";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";

function ProductDetail({ productData }: { productData: Product }) {
  const productByColor = productData.colors;
  const [selectedColor, setSelectedColor] = useState<string>(
    productByColor?.[0]?.color
  );

  const [selectedImg, setSelectedImg] = useState<number>(0);
  const pColor = productByColor.find((e) => e.color === selectedColor);
  const imgs = pColor?.imgUrls || [];
  const [selectedSize, setSelectedSize] = useState<string>();

  const _variant = pColor?.sizes.find(
    (e) => e.size.toString() === selectedSize
  );

  const valid = (_variant?.stock || 0) > 0;
  useEffect(() => {
    setSelectedImg(0);
  }, [selectedColor]);

  return (
    <div id="productDetail" className="grid grid-cols-3 gap-8">
      <div className="col-span-2">
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
            width={600}
            height={600}
          />
        </div>
      </div>
      <div className="col-span-1">
        <h4 className="font-semibold">{productData.title}</h4>

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
              {pColor?.sizes.map((prod) => (
                <ToggleGroupItem key={prod.size} value={prod.size.toString()}>
                  {prod.size}
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
          {
            <small
              className={cn(
                "mt-2",
                selectedSize && selectedColor ? "block" : "opacity-0"
              )}
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

export default ProductDetail;
