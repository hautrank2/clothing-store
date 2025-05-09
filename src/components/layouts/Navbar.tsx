import React from "react";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "~/components/ui/navigation-menu";
import Link from "next/link";
import { categoryService } from "~/services/categoryService";
import { Typography } from "../ui/typography";

async function Navbar() {
  const categoryData = await categoryService.getAll();
  const itemClassName = "bg-transparent";
  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem className={itemClassName}>
          <Link href="/" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Home
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
        <NavigationMenuItem className={itemClassName}>
          <NavigationMenuTrigger>Products</NavigationMenuTrigger>
          <NavigationMenuContent>
            <ul className="nav-item nav-item-category m-6 flex gap-8">
              {categoryData.items
                .filter((cgr) => !cgr.parentId)
                .map((cgr) => {
                  return (
                    <li key={cgr._id} className="">
                      <Link href={"/category/" + cgr.code}>
                        <Typography
                          variant={"p"}
                          className="font-semibold hover:font-bold"
                        >
                          {cgr.title}
                        </Typography>
                      </Link>
                      <ul className="nav-item-subcategory mt-2">
                        {categoryData.items
                          .filter((cgr2) => {
                            return cgr2.parentId === cgr._id;
                          })
                          .map((cgr2) => {
                            return (
                              <li key={cgr2._id} className="text-nowrap">
                                <Link href={"/category/" + cgr2.code}>
                                  <Typography
                                    variant={"p"}
                                    className="text-sm leading-8 hover:underline"
                                  >
                                    {cgr2.title}
                                  </Typography>
                                </Link>
                              </li>
                            );
                          })}
                      </ul>
                    </li>
                  );
                })}
            </ul>
          </NavigationMenuContent>
        </NavigationMenuItem>

        <NavigationMenuItem className={itemClassName}>
          <Link href="/sales" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Sale
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>

        <NavigationMenuItem className={itemClassName}>
          <Link href="/blog" legacyBehavior passHref>
            <NavigationMenuLink className={navigationMenuTriggerStyle()}>
              Blog
            </NavigationMenuLink>
          </Link>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default Navbar;
