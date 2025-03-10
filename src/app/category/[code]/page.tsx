import React from "react";
import Header from "~/components/layouts/Header";
import ProductCard from "~/components/product/ProductCard";
import { categoryService } from "~/services/categoryService";
import { productService } from "~/services/productService";

type Props = {
  params: Promise<{ code: string }>;
};

async function CategoryPage({ params }: Props) {
  const _params = await params;
  const category = await categoryService.getById(_params.code as string);
  const productData = await productService.getAll();
  return (
    <div id="categoryPage">
      <Header />
      <div className="mt-8 container">
        <ol className="breadcumb flex space-x-4">
          <li key={category._id}>
            <h5>{category.title}</h5>
          </li>
          {category.parentId && (
            <>
              <li key={category.parentId + "separate"}>/</li>
              <li key={category.parentId}>
                <h5>{category.parent?.title}</h5>
              </li>
            </>
          )}
        </ol>
        <div className="grid grid-cols-4 w-full mt-4">
          {productData.items?.map((prod, index) => {
            return (
              <div key={prod.title + index} className="col-span-1">
                <ProductCard data={prod} />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default CategoryPage;
