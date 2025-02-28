import React from "react";
import Navbar from "./Navbar";
import { Button } from "../ui/button";
import { ShoppingBag, User } from "lucide-react";

function Header() {
  return (
    <header className="flex justify-between items-center sticky top-0 h-16 px-16 border-b z-10 bg-background/90">
      <div className="header-branch">
        <h4 className="font-bold">Hautrank2</h4>
      </div>
      <div className="header-search px-16">
        <Navbar />
      </div>
      <div className="header-extra">
        <Button size={"icon"} variant={"ghost"}>
          <User />
        </Button>
        <Button size={"icon"} variant={"ghost"}>
          <ShoppingBag />
        </Button>
      </div>
    </header>
  );
}

export default Header;
