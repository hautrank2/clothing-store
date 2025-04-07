import React from "react";
import Header from "~/components/layouts/Header";
import Products from "./Products";

type Props = {
  params: Promise<{ code: string }>;
};

async function CategoryPage({ params }: Props) {
  const _params = await params;
  return (
    <div id="categoryPage pt-8">
      <Header />
      <div className="container pt-20">
        <Products code={_params.code} />
      </div>
    </div>
  );
}

export default CategoryPage;
