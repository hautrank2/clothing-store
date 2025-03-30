"use client";

import React from "react";
import useSWR from "swr";
import AddressInfo from "~/components/address/AddressInfo";
import { Button } from "~/components/ui/button";
import axiosClient from "~/lib/axios";
import { Address } from "~/types/address";
import { IUser } from "~/types/user";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { AddressForm } from "~/components/address/AddressForm";

function AddressList({ userData: _userData }: { userData: IUser }) {
  const { data: userData } = useSWR<IUser>(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/user/filter?${new URLSearchParams({
      username: _userData.username,
    }).toString()}`,
    (key: string) => axiosClient.get(key).then((res) => res.data)
  );

  return (
    <div className="address list">
      <div className="flex justify-between">
        <h1>Address list</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add address</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add address</DialogTitle>
              <DialogDescription>Fill below informations</DialogDescription>
            </DialogHeader>
            <AddressForm />
          </DialogContent>
        </Dialog>
      </div>
      <ul className="flex flex-col">
        {!userData || (userData?.address?.length === 0 && <p>No data</p>)}
        {userData &&
          userData?.address?.map((address, index) => {
            return <AddressInfo address={address} key={index} />;
          })}
      </ul>
    </div>
  );
}

export default AddressList;
