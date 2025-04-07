"use client";

import { usePathname } from "next/navigation";
import { cn } from "~/lib/utils";
import { MapPinHouse, Truck, User } from "lucide-react";
import Link from "next/link"; // 🛠 Đổi import này, bạn đang import nhầm Link từ lucide-react!

function ProfileTab() {
  const pathname = usePathname();

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
    <ul className="flex flex-col gap-4 mt-20">
      {tabs.map((tab) => {
        const Logo = tab.logo;
        const isActive = pathname === tab.href;

        return (
          <li key={tab.title}>
            <Link
              href={tab.href}
              className={cn(
                "flex gap-2 px-2 py-2 text-foreground/70",
                isActive ? "text-foreground" : "hover:text-foreground"
              )}
            >
              <Logo size={20} />
              <span>{tab.title}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

export default ProfileTab;
