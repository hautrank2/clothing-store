"use client";

import React, { useEffect } from "react";
import useSWR from "swr";
import ProductCard from "~/components/product/ProductCard";
import { Skeleton } from "~/components/ui/skeleton";
import axiosClient from "~/lib/axios";
import { Product } from "~/types/product";
import { PaginationResponse } from "~/types/query";

const ENDPOINT = process.env.NEXT_PUBLIC_API_ENDPOINT;
function Products({ code }: { code: string }) {
  const { data: category, isLoading: loadingCategory } = useSWR(
    `${ENDPOINT}/category/${code}`,
    (url: string) => axiosClient(url).then((res) => res.data)
  );

  const {
    data: products,
    mutate: fetchProduct,
    isLoading: loadingProduct,
  } = useSWR<PaginationResponse<Product>>(
    category
      ? `${ENDPOINT}/product?${new URLSearchParams({
          categoryId: category._id,
        })}`
      : null,
    (url: string) => axiosClient(url).then((res) => res.data),
    {
      revalidateOnMount: false,
    }
  );

  const isLoading = loadingCategory || loadingProduct;

  useEffect(() => {
    if (category) {
      fetchProduct();
    }
  }, [category]);

  return (
    <div className="container">
      {category && (
        <ol className="breadcumb flex space-x-4">
          {category?.parentId && (
            <>
              <li key={category.parentId}>
                <h5>{category.parent?.title}</h5>
              </li>
              <li key={category.parentId + "separate"}>/</li>
            </>
          )}

          <li key={category._id}>
            <h5>{category.title}</h5>
          </li>
        </ol>
      )}
      <div className="grid grid-cols-4 w-full mt-8 gap-4">
        {isLoading ? (
          Array.from({ length: 8 }, (_, i) => (
            <div key={i} className="col-span-1 w-full">
              <Skeleton className="w-full h-40 rounded-sm" />
              <div className="flex flex-col gap-2">
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
                <Skeleton className="w-full h-4" />
              </div>
            </div>
          ))
        ) : products && products.items.length > 0 ? (
          products?.items?.map((prod, index) => {
            return (
              <div key={prod.title + index} className="col-span-1">
                <ProductCard data={prod} />
              </div>
            );
          })
        ) : (
          <div>
            <h5>Product not found</h5>
          </div>
        )}
      </div>
    </div>
  );
}

export default Products;
