"use client";

import React, { useState } from "react";
import { cn } from "~/lib/utils";
import { Address, AddressFormValues } from "~/types/address";
import { Button } from "../ui/button";
import { Edit } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { AddressForm } from "./AddressForm";
import { IUser } from "~/types/user";
import axiosClient from "~/lib/axios";

function AddressInfo({
  userData,
  address,
  className,
  addressData,
  addressIndex = 0,
  afterEdit,
  disableEdit,
}: {
  address: Address;
  userData?: IUser;
  addressIndex?: number;
  addressData?: Address[];
  className?: string;
  afterEdit?: () => void;
  disableEdit?: boolean;
}) {
  const [openEdit, setOpenEdit] = useState(false);

  const onEditAddress = async (values: AddressFormValues) => {
    if (!addressData || !userData) return;
    try {
      const body = addressData.slice();
      body[addressIndex] = { ...values, type: values.type as Address["type"] };
      await axiosClient.put(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/user/${userData._id}/address`,
        body
      );

      afterEdit && afterEdit();
      setOpenEdit(false);
    } catch (err) {}
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <div className="flex gap-4">
        <h4>Address {addressIndex || 0 + 1} </h4>
        {disableEdit || (
          <Dialog open={openEdit} onOpenChange={setOpenEdit}>
            <DialogTrigger asChild>
              <Button variant={"ghost"}>
                <Edit />
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Edit address</DialogTitle>
                <DialogDescription>Fill below informations</DialogDescription>
              </DialogHeader>
              <AddressForm defaultValues={address} onSubmit={onEditAddress} />
            </DialogContent>
          </Dialog>
        )}
      </div>

      {Object.entries(address).map(([key, value]) => {
        return (
          <div key={key} className="flex">
            <div className="flex-[1] capitalize">{key}</div>
            <div className="flex-[2]">{value}</div>
          </div>
        );
      })}
    </div>
  );
}

export function addressToString(address: Address): string {
  const { street, district, city, country, zipCode } = address;

  return [
    street,
    district,
    city,
    country,
    zipCode, // nếu có thì thêm vào
  ]
    .filter(Boolean) // loại bỏ undefined hoặc rỗng
    .join(", ");
}

export default AddressInfo;
