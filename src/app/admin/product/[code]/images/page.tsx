"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { useProductByCode } from "~/api/product";
import { ProductImagesForm } from "~/components/product/ProductImagesForm";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import Spin from "~/components/ui/spin";

function ProductImagePage() {
  const params = useParams<{ code: string }>();
  const { code } = params;
  const { data: productData, isLoading } = useProductByCode({ code });

  return (
    <div className="product-page">
      <div className="flex gap-4">
        <Link href=".">
          <Button variant={"ghost"} icon>
            <ArrowLeft />
          </Button>
        </Link>
        <h2>Product Images</h2>
      </div>
      <Separator className="my-4" />

      {isLoading ? (
        <Spin size={23} />
      ) : (
        <ProductImagesForm defaultValues={productData} />
      )}
    </div>
  );
}

export default ProductImagePage;
