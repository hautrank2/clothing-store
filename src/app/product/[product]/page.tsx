import React, { Fragment } from "react";
import Header from "~/components/layouts/Header";
import ProductDetail from "~/components/product/ProductDetail";
import { Category } from "~/models/category";
import { categoryService } from "~/services/categoryService";
import { productService } from "~/services/productService";
import { hanldeProduct } from "~/utils/product";

type Props = {
  params: Promise<{ product: string }>;
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

async function ProductPage({ params }: Props) {
  const { product: productCode } = await params;

  const rawProduct = await productService.getByCode(productCode);
  const product = hanldeProduct(rawProduct);

  if (!product) {
    return <h1>Not found product</h1>;
  }

  const categories = await categoryService.getAll();
  const category = categories.items?.find((e) => e._id === product?.categoryId);

  // Find parent
  const parentCategory = category
    ? findParent(categories.items, category).reverse()
    : [];

  console.log(product);
  return (
    <div id="productPage">
      <Header />
      <div className="mt-8 container">
        <ol className="breadcumb flex space-x-4 border-b border-muted-foreground">
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
          <Fragment>
            <li key={product._id + "separate"}>/</li>
            <li key={product._id}>
              <h5>{product.title}</h5>
            </li>
          </Fragment>
        </ol>

        <div className="product-detail mt-4">
          <ProductDetail productData={product} />
        </div>
      </div>
    </div>
  );
}

export default ProductPage;
