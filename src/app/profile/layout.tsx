import React from "react";
import Header from "~/components/layouts/Header";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import Link from "next/link";
import { MapPinHouse, Truck, User } from "lucide-react";

type Props = { children: any };

function ProfileLayout({ children }: Props) {
  const tabs = [
    {
      logo: User,
      title: "Profile",
      href: "/profile",
    },
    {
      logo: MapPinHouse,
      title: "Address",
      href: "/profile/address",
    },
    {
      logo: Truck,
      title: "Orders",
      href: "/profile/orders",
    },
  ];

  return (
    <div className="cartPage">
      <Header />
      <div className="mt-8 container pt-24 px-8">
        <div className="flex gap-8">
          <div className="flex flex-col gap-4 mt-20">
            <ul>
              {tabs.map((tab) => {
                const Logo = tab.logo;
                return (
                  <Link
                    key={tab.title}
                    href={tab.href}
                    className="flex gap-2 px-2 py-2 text-foreground/70 hover:text-foreground"
                  >
                    <Logo size={20} /> <span>{tab.title}</span>
                  </Link>
                );
              })}
            </ul>
          </div>

          <Card className="flex-1">
            <CardContent className="space-y-4 text-sm pt-8">{children}</CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default ProfileLayout;
