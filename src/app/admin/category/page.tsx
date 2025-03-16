"use client";

import React from "react";
import { CategoryFormWrapper } from "~/components/product/CategoryForm";
import { Button } from "~/components/ui/button";
import TableWrapper from "~/components/wrapper/table-wrapper";
import { useCategory } from "~/api/category";
import { Category } from "~/models/category";
import { CategorDelete } from "~/components/product/CategoryDelete";
import { Edit2, Trash } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

function CategoryPage() {
  const searchParams = useSearchParams();
  const page = searchParams.get("page") || 1;
  const pageSize = searchParams.get("pageSize") || 10;
  const router = useRouter();
  const pathname = usePathname();
  const { data, isLoading: loading } = useCategory({ page, pageSize });
  return (
    <div className="mt-4">
      <div className="flex">
        <CategoryFormWrapper afterClose={() => {}}>
          <Button>Create</Button>
        </CategoryFormWrapper>
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
        onChangePage={(page) =>
          router.push(
            pathname +
              "?" +
              new URLSearchParams({ page: page.toString() }).toString()
          )
        }
        columns={[
          { title: "Code", dataIndex: "code" },
          { title: "Title", dataIndex: "title" },
          { title: "Image", dataIndex: "imgUrl", type: "image" },
          {
            title: "Parent",
            dataIndex: "parent",
            render: (value: Category) => (value ? value.code : ""),
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
            render: (value: string, item: Category) => {
              return (
                <div className="flex items-center gap-2">
                  <CategoryFormWrapper
                    defaultValues={{
                      ...item,
                      parentId: item.parentId || null,
                    }}
                    afterClose={() => {}}
                  >
                    <Edit2 size={16} />
                  </CategoryFormWrapper>
                  <CategorDelete categoryId={value}>
                    <Trash size={16} />
                  </CategorDelete>
                </div>
              );
            },
          },
        ]}
      />
    </div>
  );
}

export default CategoryPage;
