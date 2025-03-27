import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import CartForm from "./CartForm";

async function CartPage({}) {
  const session = await getServerSession(authOptions);
  return (
    <div>{session?.user?._id && <CartForm userId={session?.user?._id} />}</div>
  );
}

export default CartPage;
