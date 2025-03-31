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
  addressIndex,
  afterEdit,
}: {
  address: Address;
  userData?: IUser;
  addressIndex?: number;
  addressData?: Address[];
  className?: string;
  afterEdit?: () => void;
}) {
  const [openEdit, setOpenEdit] = useState(false);

  const onEditAddress = async (values: AddressFormValues) => {
    if (!addressData || !addressIndex || !userData) return;
    try {
      const body = addressData.slice();
      body[addressIndex] = { ...values, type: values.type as Address["type"] };
      await axiosClient.put(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/${userData._id}/address`,
        body
      );
      afterEdit && afterEdit();
    } catch (err) {}
  };

  return (
    <div className={cn("flex flex-col gap-2", className)}>
      <Dialog open={openEdit} onOpenChange={setOpenEdit}>
        <DialogTrigger asChild>
          <Button variant={"ghost"}>
            <Edit />
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add address</DialogTitle>
            <DialogDescription>Fill below informations</DialogDescription>
          </DialogHeader>
          <AddressForm defaultValues={address} onSubmit={onEditAddress} />
        </DialogContent>
      </Dialog>

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
