import React from "react";
import Header from "~/components/layouts/Header";
import { Card, CardContent } from "~/components/ui/card";
import { headers } from "next/headers";
import ProfileTab from "./ProfileTab";

type Props = { children: any };

async function ProfileLayout({ children }: Props) {
  const headersList = await headers();

  return (
    <div className="cartPage">
      <Header />
      <div className="mt-8 container pt-24 px-8">
        <div className="flex gap-12 relative">
          <div className="fixed top-20 w-32">
            <ProfileTab />
          </div>
          <div className="flex-1 ms-32">
            <div className="space-y-4 text-sm pt-8">{children}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfileLayout;
