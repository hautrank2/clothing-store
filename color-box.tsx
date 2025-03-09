import React from "react";
import { cn } from "~/lib/utils";

export interface ColorBoxProps extends React.HTMLAttributes<HTMLDivElement> {
  color: string;
  active?: boolean;
}

const ColorBox = React.forwardRef<HTMLDivElement, ColorBoxProps>(
  ({ className, color, active, ...props }: ColorBoxProps, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "color-box h-6 w-6 border rounded-full",
          active
            ? "border-foreground"
            : "border-muted hover:border-foreground hover:pointer hover:cursor-pointer",
          className
        )}
        style={{ backgroundColor: color }}
        {...props}
      ></div>
    );
  }
);

ColorBox.displayName = "ColorBox";

export default ColorBox;
