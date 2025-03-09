import { GetServerSideProps } from "next";
import React, { Fragment } from "react";
import Header from "~/components/layouts/Header";
import ProductCard from "~/components/product/ProductCard";
import { CategoryPopulate } from "~/models/category";
import { Product } from "~/models/product";
import { PaginationResponse } from "~/models/query";
import { categoryService } from "~/services/categoryService";
import { productService } from "~/services/productService";

type Props = {
  params: Promise<{ category: string }>;
  productData: PaginationResponse<Product>;
  category: CategoryPopulate;
};
export const getServerSideProps: GetServerSideProps = async ({ params }) => {
  try {
    if (!params?.code) throw new Error("Category ID is missing");
    const category = await categoryService.getById(params.code as string);
    const productData = await productService.getAll();
    return { props: { category, productData } };
  } catch (error) {
    console.error("Error fetching product:", error);
    return { notFound: true }; // Trả về 404 nếu không tìm thấy sản phẩm
  }
};

async function CategoryPage({ productData, category }: Props) {
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
              <li key={category.parentId._id + "separate"}>/</li>
              <li key={category.parentId._id}>
                <h5>{category.parentId.title}</h5>
              </li>
            </>
          )}
        </ol>
        <div className="grid grid-cols-4 w-full mt-4">
          {productData.items.map((prod, index) => {
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
