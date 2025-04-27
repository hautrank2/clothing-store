import React from "react";
import Navbar from "./Navbar";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import UserBtn from "./UserBtn";
import { getServerSession } from "next-auth";
import { authOptions } from "~/app/api/auth/[...nextauth]/route";
import { Typography } from "../ui/typography";
import { cn } from "~/lib/utils";

type Props = {
  theme?: "light" | "dark";
  className?: string;
};

async function Header({ theme, className }: Props) {
  const session = await getServerSession(authOptions);

  return (
    <header
      className={cn(
        "flex justify-between items-center w-full fixed top-0 h-16 px-16 border-b z-20 bg-background/90 text-foreground/90",
        theme || "dark",
        className
      )}
    >
      <div className="header-branch">
        <Typography variant={"h2"} className="font-bold">
          Hautrank2
        </Typography>
      </div>
      <div className="header-search px-16">
        <Navbar />
      </div>
      <div className="header-extra flex items-center gap-4">
        <UserBtn session={session} />
        {session?.user && (
          <Link href={"/cart"} className="hover:bg-accent p-2 rounded">
            <ShoppingBag />
          </Link>
        )}
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
