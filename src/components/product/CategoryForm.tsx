"use client";

import React, { ReactNode, useEffect, useState } from "react";
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
import { FileUpload } from "../ui/upload";
import SelectWrapper from "../wrapper/select-wrapper";
import { Category } from "~/models/category";
import { Option } from "~/models/common";
import { useCategory, usePatchCategory, usePostCategory } from "~/api/category";
import { fetchFile, filesArrayToFileList } from "~/utils/file";

export const categorySchema = z.object({
  _id: z.string().optional(), // _id có thể là undefined nếu tạo mới
  code: z.string().min(1, "Code is required"),
  title: z.string().min(1, "Title is required"),
  imgs: z.custom<FileList>(
    (files) => files instanceof FileList,
    "At least one file is required"
  ),
  parentId: z.string().optional().nullable(),
});

export type CategoryFormValues = z.infer<typeof categorySchema>;

export interface Props {
  onSubmit?: (date: CategoryFormValues) => void;
}
export interface CategoryProps extends Props {
  children: ReactNode;
  afterClose: (refetch: boolean) => void;
  defaultValues?: Category;
}

export function CategoryFormWrapper({
  afterClose,
  defaultValues,
  children,
}: CategoryProps) {
  const isEdit = !!defaultValues;
  const [open, setOpen] = useState(false);
  const { data } = useCategory();

  const categoryData =
    data?.items
      .filter((e: Category) => e._id !== defaultValues?._id && !e.parentId)
      .map((e: Category) => ({
        label: e.title,
        value: e._id,
      })) || [];

  const { trigger, isMutating } = usePostCategory();
  const { trigger: triggerPatch, isMutating: isPatchMutating } =
    usePatchCategory();
  const loading = isMutating || isPatchMutating;

  const onSubmit = async (values: CategoryFormValues) => {
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
    categoryData,
    onSubmit,
    loading,
  };
  return (
    <ModalWrapper
      title={"Category"}
      content={
        defaultValues ? (
          <PrepareForm defaultValues={defaultValues}>
            <CategoryForm {...formProps} />
          </PrepareForm>
        ) : (
          <CategoryForm {...formProps} />
        )
      }
      open={open}
      onOpenChange={(value) => setOpen(value)}
    >
      <div className="hover:cursor-pointer" onClick={() => setOpen(true)}>
        {children}
      </div>
    </ModalWrapper>
  );
}

const PrepareForm = ({
  defaultValues: _defauleValue,
  children,
}: {
  defaultValues: Category;
  children: ReactNode;
}) => {
  const [defaultValues, setdefaultValues] = useState<CategoryFormValues | null>(
    null
  );

  const prepare = async () => {
    try {
      const api = await fetchFile(_defauleValue.imgUrl);
      if (api && api instanceof File) {
        const fileList = filesArrayToFileList([api]);
        setdefaultValues({
          ..._defauleValue,
          imgs: fileList,
        });
      }
    } catch {}
  };

  useEffect(() => {
    prepare();
  }, []);

  if (!defaultValues) {
    return <div>Loading...</div>;
  }

  return React.Children.map(children, (child) => {
    if (React.isValidElement<{ defaultValues: CategoryFormValues }>(child)) {
      return React.cloneElement(child, {
        defaultValues,
      });
    }
  });
};

export interface CategoryFormProps extends Props {
  categoryData?: Option[];
  defaultValues?: CategoryFormValues;
  loading: boolean;
}

export function CategoryForm({
  defaultValues,
  categoryData = [],
  onSubmit: _onSubmit,
  loading,
}: CategoryFormProps) {
  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categorySchema),
    defaultValues: defaultValues || {
      code: "",
      title: "",
      parentId: null,
    },
  });

  const onSubmit = (data: CategoryFormValues) => {
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
                  placeholder="Enter category code"
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
                  placeholder="Enter category title"
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
              <FormLabel>Parent Category</FormLabel>
              <FormControl>
                <SelectWrapper
                  {...commonProps}
                  {...field}
                  options={categoryData}
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
