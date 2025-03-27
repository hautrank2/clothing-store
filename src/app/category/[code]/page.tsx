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
  const products = await productService.getAll({ categoryId: category._id });

  return (
    <div id="categoryPage pt-8">
      <Header />
      <div className="container pt-20">
        <ol className="breadcumb flex space-x-4">
          {category.parentId && (
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
        <div className="container grid grid-cols-4 w-full mt-8">
          {products && products.items.length > 0 ? (
            products.items?.map((prod, index) => {
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
    </div>
  );
}

export default CategoryPage;
