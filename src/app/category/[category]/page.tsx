import React, { Fragment } from "react";
import Header from "~/components/layouts/Header";
import ProductCard from "~/components/product/ProductCard";
import { FAKE_CATEGORIES } from "~/data/category";
import { FAKE_PRODUCTS } from "~/data/product";
import { Category } from "~/models/category";

type Props = {
  params: Promise<{ category: string }>;
};

const findParent = (categories: Category[], category: Category): Category[] => {
  const { parentId } = category;

  if (parentId) {
    const find = categories.find((e) => e._id === parentId);
    if (find) {
      return [category, ...findParent(categories, find)];
    }
  }

  return [category];
};

async function CategoryPage({ params }: Props) {
  const categoryCode = (await params).category;
  const categories = FAKE_CATEGORIES;
  const category = categories.find((e) => e.code === categoryCode);

  // Find parent
  const parentCategory = category
    ? findParent(categories, category).reverse()
    : [];

  const products = FAKE_PRODUCTS;
  return (
    <div id="categoryPage">
      <Header />
      <div className="mt-8 container">
        <ol className="breadcumb flex space-x-4">
          {parentCategory.map((cgr, index) => {
            return (
              <Fragment key={cgr._id + index}>
                {index !== 0 && <li key={cgr._id + "separate"}>/</li>}
                <li key={cgr._id}>
                  <h5>{cgr.title}</h5>
                </li>
              </Fragment>
            );
          })}
        </ol>
        <div className="grid grid-cols-4 w-full mt-4">
          {products.map((prod, index) => {
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
