"use client";

import Image from "next/image";
import React, { useState } from "react";
import { cn } from "~/lib/utils";
import { Button } from "../ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

function Banner({ urls }: { urls: string[] }) {
  const [sel, setSel] = useState<number>(0);
  return (
    <div className="banner w-full h-full relative overflow-hidden">
      <ul
        className={cn(
          "banner-list h-full flex overflow-hidden absolute inset-x-0 transition duration-500 easy-out"
        )}
        style={{
          width: `${urls.length * 100}%`,
          transform: `translateX(${(-sel * 100) / urls.length}%)`,
        }}
      >
        {urls.map((imgUrl, index) => {
          return (
            <li
              key={imgUrl + index}
              className={cn("h-full relative")}
              style={{ width: `${100 / urls.length}%` }}
            >
              <Image src={imgUrl} alt={imgUrl} fill objectFit="cover" objectPosition="top" />
            </li>
          );
        })}
      </ul>
      <Button
        className="absolute left-2 top-[50%] h-20 translate-y-[-50%] bg-foreground/20 hover:bg-foreground/40"
        variant={"secondary"}
        onClick={() =>
          setSel((pre) => (pre - 1 >= 0 ? pre - 1 : urls.length - 1))
        }
      >
        <ChevronLeft />
      </Button>
      <Button
        className="absolute right-2 top-[50%] h-20 translate-y-[-50%] bg-foreground/20 hover:bg-foreground/40"
        variant={"secondary"}
        onClick={() => setSel((pre) => (pre + 1 < urls.length ? pre + 1 : 0))}
      >
        <ChevronRight />
      </Button>
      <div className="banner-index absolute bottom-2 inset-x-0 flex justify-center gap-2">
        {urls.map((_, index) => {
          return (
            <div
              key={index}
              className={cn(
                "h-2 w-2 border-foreground border rounded-full ",
                index === sel
                  ? "bg-background"
                  : "bg-background/60 hover:cursor-pointer"
              )}
              onClick={() => setSel(index)}
            />
          );
        })}
      </div>
    </div>
  );
}

export default Banner;
