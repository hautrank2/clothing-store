import React from "react";
import Header from "~/components/layouts/Header";

function CartLayout({ children }: { children: any }) {
  return (
    <div className="cartPage">
      <Header />
      <div className="mt-8 container pt-24 px-8">{children} </div>
    </div>
  );
}

export default CartLayout;
