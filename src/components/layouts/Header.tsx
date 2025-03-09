import React from "react";
import Navbar from "./Navbar";
import { Button } from "../ui/button";
import { ShoppingBag, User } from "lucide-react";
import Link from "next/link";

async function Header() {
  return (
    <header className="flex justify-between items-center sticky top-0 h-16 px-16 border-b z-20 bg-background/90">
      <div className="header-branch">
        <h4 className="font-bold">Hautrank2</h4>
      </div>
      <div className="header-search px-16">
        <Navbar />
      </div>
      <div className="header-extra flex items-center space-x-1">
        <Button size={"icon"} variant={"ghost"}>
          <User />
        </Button>
        <Button size={"icon"} variant={"ghost"}>
          <ShoppingBag />
        </Button>
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
