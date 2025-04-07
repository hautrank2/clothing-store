import React from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "~/components/ui/form";
import { useForm } from "react-hook-form";
import { Address, AddressFormValues, addressSchema } from "~/types/address";
import { Input } from "../ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../ui/button";

function AddressForm({
  onSubmit,
  defaultValues,
}: {
  onSubmit: (values: AddressFormValues) => void;
  defaultValues?: Address;
}) {
  const isEdit = !!defaultValues;
  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: defaultValues || {
      street: "",
      city: "",
      district: "",
      postalCode: "",
      country: "",
      type: "home",
    },
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {(["country", "city", "district", "street", "postalCode"] as const).map(
          (fieldName) => (
            <FormField
              key={fieldName}
              control={form.control}
              name={fieldName}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {fieldName.charAt(0).toUpperCase() + fieldName.slice(1)}
                  </FormLabel>
                  <FormControl>
                    <Input placeholder={`Enter ${fieldName}`} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          )
        )}

        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}

export { AddressForm };
