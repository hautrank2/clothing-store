import React from "react";
import Navbar from "./Navbar";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import UserBtn from "./UserBtn";
import { getServerSession } from "next-auth";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";

async function Header() {
  const session = await getServerSession(authOptions);

  return (
    <header className="flex justify-between items-center w-full fixed top-0 h-16 px-16 border-b z-20 bg-background/90">
      <div className="header-branch">
        <h4 className="font-bold">Hautrank2</h4>
      </div>
      <div className="header-search px-16">
        <Navbar />
      </div>
      <div className="header-extra flex items-center gap-4">
        <UserBtn session={session} />
        <Link href={"/cart"}>
          <ShoppingBag />
        </Link>
        <Link href={"/"} className="rounded border p-2">
          Shop
        </Link>
        <Link href={"/admin"} className="rounded border p-2">
          Admin
        </Link>
      </div>
    </header>
  );
}

export default Header;
