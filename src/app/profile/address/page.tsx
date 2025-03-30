import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";
import AddressList from "./AddressList";

async function AddressPage({}) {
  const session = await getServerSession(authOptions);
  return <div>{session?.user && <AddressList userData={session.user} />}</div>;
}

export default AddressPage;
