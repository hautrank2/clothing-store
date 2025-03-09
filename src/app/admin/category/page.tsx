"use client";

import React from "react";
import { CategoryFormWrapper } from "~/components/product/CategoryForm";
import { Button } from "~/components/ui/button";
import TableWrapper from "~/components/wrapper/table-wrapper";
import { useCategory } from "~/api/category";
import { Category, CategoryPopulate } from "~/models/category";
import { CategorDelete } from "~/components/product/CategoryDelete";
import { Edit2, Trash } from "lucide-react";

function CategoryPage() {
  const { data = [], isLoading } = useCategory();

  return (
    <div className="mt-4">
      <div className="flex">
        <CategoryFormWrapper afterClose={() => {}}>
          <Button>Create</Button>
        </CategoryFormWrapper>
      </div>
      <TableWrapper
        className="mt-2"
        data={data}
        loading={isLoading}
        columns={[
          { title: "Code", dataIndex: "code" },
          { title: "Title", dataIndex: "title" },
          { title: "Image", dataIndex: "imgUrl", type: "image" },
          {
            title: "Parent",
            dataIndex: "parentId",
            render: (value: Category) => (value ? value.code : "No data"),
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
            render: (value: string, item: CategoryPopulate) => {
              return (
                <div className="flex items-center gap-2">
                  <CategoryFormWrapper
                    defaultValues={{
                      ...item,
                      parentId: item.parentId
                        ? typeof item.parentId === "string"
                          ? item.parentId
                          : item.parentId.parentId
                        : null,
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
