import React from "react";
import { cn } from "~/lib/utils";
import { Address } from "~/types/address";

function AddressInfo({
  address,
  className,
}: {
  address: Address;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-2", className)}>
      {Object.entries(address).map(([key, value]) => {
        return (
          <div key={key} className="flex">
            <div className="flex-[1]">{key}</div>
            <div className="flex-[2]">{value}</div>
          </div>
        );
      })}
    </div>
  );
}

export default AddressInfo;
