"use client";

import { ChevronDown, LogOut, User } from "lucide-react";
import { Button } from "../ui/button";
import Link from "next/link";
import React, { ReactNode, useEffect, useState } from "react";
import type { Session } from "next-auth";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";

function UserBtn({ session }: { session: Session | null }) {
  const [user, setUser] = useState();

  useEffect(() => {
    const local = localStorage.getItem("user");
    setUser(local ? JSON.parse(local) : null);
  }, []);

  const onLogout = () => {
    console.log("on logout");
  };
  return session ? (
    <p>
      <ExistButton onLogout={onLogout}>
        <div className="flex items-center gap-2 hover:text-semibold hover:cursor-pointer">
          <User />
          {session.user?.name || session.user?.username}
          <ChevronDown />
        </div>
      </ExistButton>
    </p>
  ) : (
    <Link href={user ? "/profile" : "/auth/signin"}>
      <Button size={"icon"} variant={"link"}>
        <User />
      </Button>
    </Link>
  );
}

const ExistButton = ({
  children,
  onLogout,
}: {
  children: ReactNode;
  onLogout: () => void;
}) => {
  const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{children}</DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push('/auth/profile')}>
            <User />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onLogout}>
            <LogOut />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserBtn;
