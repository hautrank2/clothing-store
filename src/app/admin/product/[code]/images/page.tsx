"use client";

import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { toast } from "sonner";
import { usePostUploadProductImg, useProductByCode } from "~/api/product";
import { ProductImagesForm } from "~/components/product/ProductImagesForm";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import Spin from "~/components/ui/spin";

function ProductImagePage() {
  const params = useParams<{ code: string }>();
  const { code } = params;
  const { data: productData, isLoading, mutate } = useProductByCode({ code });
  const { trigger, isMutating: loadingUpload } = usePostUploadProductImg();

  const onChange = async (
    colorIndex: number,
    imgIndex: number,
    image: File
  ) => {
    try {
      const api = await trigger({
        id: productData._id,
        imgIndex,
        colorIndex,
        image,
      });
      mutate();
      toast("Upload success", {
        description: `Product code: ${api.code}`,
        action: "success",
      });
    } catch (err) {
      toast("Upload failed", {
        description: JSON.stringify(err),
        action: "error",
      });
    }
  };

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
        <ProductImagesForm
          loading={loadingUpload}
          defaultValues={productData}
          onChange={onChange}
        />
      )}
    </div>
  );
}

export default ProductImagePage;
