"use client";

import { ChevronDown, LogOut, User } from "lucide-react";
import Link from "next/link";
import React, { ReactNode, useEffect, useState } from "react";
import type { Session } from "next-auth";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { signOut } from "next-auth/react";

function UserBtn({ session }: { session: Session | null }) {
  const [user, setUser] = useState();

  useEffect(() => {
    const local = localStorage.getItem("user");
    setUser(local ? JSON.parse(local) : null);
  }, []);

  const onLogout = () => {
    signOut({ callbackUrl: "/" });
  };
  return session ? (
    <ExistButton onLogout={onLogout}>
      <div className="flex items-center gap-2 hover:text-semibold hover:cursor-pointer hover:bg-accent p-2 rounded">
        <User />
        {session.user?.name || session.user?.username}
        <ChevronDown />
      </div>
    </ExistButton>
  ) : (
    <Link
      href={user ? "/profile" : "/auth/signin"}
      className="hover:bg-accent p-2 rounded"
    >
      <User />
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
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={() => router.push("/profile")}>
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
