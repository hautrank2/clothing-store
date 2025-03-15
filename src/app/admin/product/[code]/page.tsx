"use client";

import { ArrowLeft, Images } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { useCategory } from "~/api/category";
import { ProductFormValues, useProductByCode } from "~/api/product";
import ProductForm from "~/components/product/ProductForm";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import Spin from "~/components/ui/spin";

function ProductAdminPage() {
  const params = useParams<{ code: string }>();
  const { code } = params;
  const { data: productData, isLoading } = useProductByCode({ code });
  const { data: categoryData } = useCategory();

  const onSubmit = (values: ProductFormValues) => {
    console.log("onSubmit", values);
  };

  return (
    <div className="product-page">
      <div className="flex gap-4 items-center">
        <Link href=".">
          <Button variant={"ghost"} icon>
            <ArrowLeft />
          </Button>
        </Link>
        <h2>Edit product</h2>
        <Link href={`./${code}/images`}>
          <Images />
        </Link>
      </div>
      <Separator className="my-4" />
      {isLoading ? (
        <Spin size={40} />
      ) : (
        <ProductForm
          categories={categoryData?.items || []}
          defaultValues={productData}
          onSubmit={onSubmit}
        />
      )}
    </div>
  );
}

export default ProductAdminPage;
