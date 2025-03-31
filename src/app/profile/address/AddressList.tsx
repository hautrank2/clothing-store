"use client";

import React, { useState } from "react";
import useSWR from "swr";
import AddressInfo from "~/components/address/AddressInfo";
import { Button } from "~/components/ui/button";
import axiosClient from "~/lib/axios";
import { Address, AddressFormValues } from "~/types/address";
import { IUser } from "~/types/user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { AddressForm } from "~/components/address/AddressForm";

function AddressList({ userData: _userData }: { userData: IUser }) {
  const [openAdd, setOpenAdd] = useState(false);
  const { data: userData, mutate } = useSWR<IUser>(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/user/filter?${new URLSearchParams({
      username: _userData.username,
    }).toString()}`,
    (key: string) => axiosClient.get(key).then((res) => res.data)
  );

  const onAddAddress = async (values: AddressFormValues) => {
    try {
      const body = userData?.address?.slice();
      body?.unshift({ ...values, type: values.type as Address["type"] });
      await axiosClient.put(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/${_userData._id}/address`,
        body
      );
      mutate();
    } catch (err) {}
  };

  return (
    <div className="address list">
      <div className="flex justify-between">
        <h1>Address list</h1>
        <Dialog open={openAdd} onOpenChange={setOpenAdd}>
          <DialogTrigger asChild>
            <Button>Add address</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add address</DialogTitle>
              <DialogDescription>Fill below informations</DialogDescription>
            </DialogHeader>
            <AddressForm onSubmit={onAddAddress} />
          </DialogContent>
        </Dialog>
      </div>
      <ul className="flex flex-col">
        {!userData || (userData?.address?.length === 0 && <p>No data</p>)}
        {userData &&
          userData?.address?.map((address, index) => {
            return (
              <AddressInfo
                address={address}
                key={index}
                addressIndex={index}
                addressData={userData.address}
                userData={userData}
                afterEdit={() => mutate()}
              />
            );
          })}
      </ul>
    </div>
  );
}

export default AddressList;
