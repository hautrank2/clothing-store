"use client";

import React, { ReactNode, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "~/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { z } from "zod";
import { Input } from "../ui/input";
import ModalWrapper from "../wrapper/modal-wrapper";
import FileUpload from "../ui/upload";
import SelectWrapper from "../wrapper/select-wrapper";
import { Product } from "~/models/product";
import { Option } from "~/models/common";
import { useProduct, usePatchProduct, usePostProduct } from "~/api/product";

export const ProductSchema = z.object({
  _id: z.string().optional(), // _id có thể là undefined nếu tạo mới
  code: z.string().min(1, "Code is required"),
  title: z.string().min(1, "Title is required"),
  imgs: z.custom<FileList>(
    (files) => files instanceof FileList,
    "At least one file is required"
  ),
  parentId: z.string().optional().nullable(),
});

export type ProductFormValues = z.infer<typeof ProductSchema>;

export interface Props {
  onSubmit?: (date: ProductFormValues) => void;
}
export interface ProductProps extends Props {
  children: ReactNode;
  afterClose: (refetch: boolean) => void;
  defaultValues?: Product;
}

export function ProductFormWrapper({
  afterClose,
  defaultValues,
  children,
}: ProductProps) {
  const isEdit = !!defaultValues;
  const [open, setOpen] = useState(false);
  const { data } = useProduct();

  const ProductData =
    data?.items.map((e: Product) => ({
      label: e.title,
      value: e._id,
    })) || [];

  const { trigger, isMutating } = usePostProduct();
  const { trigger: triggerPatch, isMutating: isPatchMutating } =
    usePatchProduct();
  const loading = isMutating || isPatchMutating;

  const onSubmit = async (values: ProductFormValues) => {
    //hanlde Data
    if (values.imgs.length === 0) {
      return;
    }

    try {
      if (!isEdit) {
        const image = values.imgs[0];
        await trigger({
          image,
          code: values.code,
          title: values.title,
          parentId: values.parentId,
        });
        setOpen(false);
        afterClose(true);
      } else {
        const image = values.imgs[0];
        await triggerPatch({
          id: defaultValues._id,
          body: {
            image,
            code: values.code,
            title: values.title,
            parentId: values.parentId,
          },
        });
        setOpen(false);
        afterClose(true);
      }
    } catch {}
  };

  const formProps = {
    ProductData,
    onSubmit,
    loading,
  };
  return (
    <ModalWrapper
      title={"Product"}
      content={<ProductForm {...formProps} />}
      open={open}
      onOpenChange={(value) => setOpen(value)}
    >
      <div className="hover:cursor-pointer" onClick={() => setOpen(true)}>
        {children}
      </div>
    </ModalWrapper>
  );
}

export interface ProductFormProps extends Props {
  ProductData?: Option[];
  defaultValues?: ProductFormValues;
  loading: boolean;
}

export function ProductForm({
  defaultValues,
  ProductData = [],
  onSubmit: _onSubmit,
  loading,
}: ProductFormProps) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(ProductSchema),
    defaultValues: defaultValues || {
      code: "",
      title: "",
      parentId: null,
    },
  });

  const onSubmit = (data: ProductFormValues) => {
    if (_onSubmit) {
      _onSubmit(data);
    }
  };

  const commonProps = {
    disabled: loading,
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 rounded-lg"
      >
        {/* Code */}
        <FormField
          control={form.control}
          name="code"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Product code"
                  {...commonProps}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Title */}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Product title"
                  {...commonProps}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="parentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Parent Product</FormLabel>
              <FormControl>
                <SelectWrapper
                  {...commonProps}
                  {...field}
                  options={ProductData}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imgs"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Image</FormLabel>
              <FormControl>
                <FileUpload {...commonProps} {...field} max={1} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Submit Button */}
        <Button type="submit">Save</Button>
      </form>
    </Form>
  );
}
