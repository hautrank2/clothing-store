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
        <div className="flex gap-8 relative">
          <div className="fixed top-20 w-32">
            <ProfileTab />
          </div>

          <Card className="flex-1 ms-32">
            <CardContent className="space-y-4 text-sm pt-8">
              {children}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ProfileLayout;
