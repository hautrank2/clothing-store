import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "~/lib/utils";

const typographyVariants = cva("", {
  variants: {
    variant: {
      h1: "scroll-m-20 text-4xl font-semibold tracking-tight text-foreground",
      h2: "scroll-m-20 text-3xl font-semibold tracking-tight first:mt-0 text-foreground",
      h3: "scroll-m-20 text-2xl font-semibold tracking-tight text-foreground",
      h4: "scroll-m-20 text-xl font-semibold tracking-tight text-foreground",
      h5: "scroll-m-20 text-lg font-semibold tracking-tight text-foreground",
      p: "leading-6 [&:not(:first-child)]:mt-2 text-foreground/80",
      blockquote: "mt-6 border-l-2 pl-6 italic text-foreground",
      small: "text-sm font-medium leading-none text-foreground",
    },
  },
  defaultVariants: {
    variant: "p",
  },
});

export interface TypographyProps
  extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
  asChild?: boolean;
}

function Typography({
  className,
  variant,
  asChild = false,
  ...props
}: TypographyProps) {
  const Comp = asChild ? Slot : variant || "p";

  return (
    <Comp
      data-slot="typography"
      className={cn(typographyVariants({ variant }), className)}
      {...props}
    />
  );
}

export { Typography, typographyVariants };
