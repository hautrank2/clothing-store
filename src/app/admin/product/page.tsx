"use client";

import { Edit2, Images } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useProduct } from "~/api/product";
import { ProductFormWrapper } from "~/components/product/ProductForm";
import { Button } from "~/components/ui/button";
import TableWrapper from "~/components/wrapper/table-wrapper";
import { Product } from "~/models/product";

function ProductPage({}) {
  const { data, isLoading: loading } = useProduct();

  return (
    <div className="mt-4">
      <div className="flex">
        <ProductFormWrapper afterClose={() => {}}>
          <Button>Create</Button>
        </ProductFormWrapper>
      </div>
      <TableWrapper
        className="mt-2"
        data={data ? data.items : []}
        loading={loading}
        pagination={
          data && {
            pageSize: data.pageSize,
            pageIndex: data.page,
            totalCount: data.total,
            totalPage: data.totalPage,
          }
        }
        columns={[
          {
            title: "Image",
            dataIndex: ["colors", "0", "imgUrls", "0"],
            type: "image",
          },
          { title: "Code", dataIndex: "code" },
          { title: "Title", dataIndex: "title" },
          {
            title: "Price",
            dataIndex: "price",
            render: (value) => `$${value}`,
          },
          {
            title: "Category",
            dataIndex: "category",
            render: (value) => value?.title,
          },
          {
            title: "Created at",
            dataIndex: "createdAt",
            type: "datetime",
          },
          {
            title: "Updated at",
            dataIndex: "updatedAt",
            type: "datetime",
          },
          {
            title: "",
            dataIndex: "_id",
            render: (value: string, item: Product) => {
              return (
                <div className="flex items-center gap-2">
                  <Link href={`./product/${item.code}`}>
                    <Edit2 />
                  </Link>
                  <Link href={`./product/${item.code}/images`}>
                    <Images />
                  </Link>
                </div>
              );
            },
          },
        ]}
      />
    </div>
  );
}

export default ProductPage;
