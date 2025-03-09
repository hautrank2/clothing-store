"use-client";

import React, { forwardRef } from "react";
import { FunctionComponent } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { Option } from "~/models/common";

interface IProp {
  options?: Option[] | [];
  placeholder?: string;
  render?: (value: any, option: Option) => any;
  [key: string]: any;
}

const SelectWrapper: FunctionComponent<IProp> = forwardRef(
  (
    {
      options = [],
      placeholder = "Select...",
      onChange,
      classNames = {},
      render,
      width,
      ...props
    },
    ref
  ) => {
    const { value } = props;
    return (
      <Select {...props} onValueChange={onChange}>
        <SelectTrigger
          className={cn(value || "text-muted-foreground", classNames.trigger)}
          style={{ width }}
        >
          {value ? "" : placeholder}
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectGroup>
            {options.map((option: any, ix: number) => {
              return (
                <SelectItem key={option.value + ix} value={option.value}>
                  {render ? render(option.value, option) : option.label}
                </SelectItem>
              );
            })}
          </SelectGroup>
        </SelectContent>
      </Select>
    );
  }
);

SelectWrapper.displayName = "SelectWrapper";
export default SelectWrapper;
