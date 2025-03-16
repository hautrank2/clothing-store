"use client";

import { AlertCircle, ArrowLeft, Images } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import React from "react";
import { useCategory } from "~/api/category";
import {
  ProductFormValues,
  usePatchProduct,
  useProductByCode,
} from "~/api/product";
import ProductForm from "~/components/product/ProductForm";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import Spin from "~/components/ui/spin";
import { toast } from "sonner";
import { Alert, AlertDescription, AlertTitle } from "~/components/ui/alert";

function ProductAdminPage() {
  const params = useParams<{ code: string }>();
  const { code } = params;
  const { data: productData, isLoading, error } = useProductByCode({ code });
  const { trigger } = usePatchProduct();
  const { data: categoryData } = useCategory();

  const onSubmit = async (body: ProductFormValues) => {
    try {
      await trigger({ id: productData._id, body });
      toast("Update successful", { action: "success" });
    } catch (err) {
      toast(JSON.stringify(err), {
        action: "error",
      });
    }
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
      ) : error ? (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{JSON.stringify(error)}</AlertDescription>
        </Alert>
      ) : (
        <ProductForm
          categories={categoryData?.items || []}
          defaultValues={productData}
          onSubmit={onSubmit}
          loading={isLoading}
        />
      )}
    </div>
  );
}

export default ProductAdminPage;
