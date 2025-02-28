import Image from "next/image";
import React from "react";
import Header from "~/components/layouts/Header";
import { FAKE_CATEGORIES } from "~/data/category";
import { FAKE_PRODUCTS } from "~/data/product";
import { cn } from "~/lib/utils";
import { Category } from "~/models/category";
import { ProductVariant } from "~/models/product";

type Props = {
  params: Promise<{ category: string }>;
};

const findParent = (categories: Category[], category: Category): Category[] => {
  const { parentId } = category;

  if (parentId) {
    const find = categories.find((e) => e._id === parentId);
    if (find) {
      return [category, ...findParent(categories, find)];
    }
  }

  return [category];
};

async function CategoryPage({ params }: Props) {
  const categoryCode = (await params).category;
  const categories = FAKE_CATEGORIES;
  const category = categories.find((e) => e.code === categoryCode);

  // Find parent
  const parentCategory = category ? findParent(categories, category) : [];

  const products = FAKE_PRODUCTS;
  return (
    <div>
      <Header />
      <div id="categoryPage" className="mt-8 container max-w-[80vw] mx-auto">
        <ol className="breadcumb flex space-x-4">
          {parentCategory.map((cgr, index) => {
            return (
              <>
                {index !== 0 && <li key={cgr._id + "separate"}>/</li>}
                <li key={cgr._id}>
                  <h5>{cgr.title}</h5>
                </li>
              </>
            );
          })}
        </ol>
        <div className="grid grid-cols-4 w-full">
          {products.map((prod, index) => {
            return (
              <div key={prod.title + index} className="col-span-1">
                <div className="product-card rounded p-4">
                  <Image
                    src="/img/category/t_shirt.jpeg"
                    alt="img-product"
                    objectFit="cover"
                    width={300}
                    height={300}
                    className="mx-auto"
                  />
                  <div className="product-info my-2">
                    <p>{prod.title}</p>
                    <div className="flex product-colors gap-1">
                      {getUniqueColors(prod.variants).map((variant, ix) => (
                        <div
                          key={variant.hexCode + ix}
                          className={cn(
                            "rounded-full h-4 w-4 border border-foreground hover:cursor-pointer",
                            `bg-[${variant.hexCode}]`
                          )}
                          style={{ backgroundColor: variant.hexCode }}
                        />
                      ))}
                    </div>
                    <h5 className="mt-1">{`$${prod.price}`}</h5>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
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

export default CategoryPage;
