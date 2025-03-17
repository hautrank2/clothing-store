import { ShoppingBasket, SquareMenu } from "lucide-react";
import { headers } from "next/headers";
import React from "react";
import Header from "~/components/layouts/Header";
import {
  SidebarProvider,
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarFooter,
} from "~/components/ui/sidebar";

async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headerList = await headers();
  const path = headerList.get("path");

  // Menu items.
  const items = [
    {
      title: "Category",
      url: "/admin/category",
      icon: SquareMenu,
    },
    {
      title: "Product",
      url: "/admin/product",
      icon: ShoppingBasket,
    },
  ];
  return (
    <div>
      <Header />
      <SidebarProvider className="min-h-auto">
        <Sidebar className="top-16">
          <SidebarContent>
            <SidebarGroup />
            <SidebarGroupContent>
              <SidebarMenu>
                {items.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url}>
                        <item.icon />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
            <SidebarGroup />
          </SidebarContent>
          <SidebarFooter />
        </Sidebar>
        <main className="admin-page m-8 w-full">
          <div className="breadcumb sticky">
            <h4>{path}</h4>
          </div>
          {children}
        </main>
      </SidebarProvider>
    </div>
  );
}

export default AdminLayout;
