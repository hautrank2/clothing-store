"use client";

import { useForm, useFieldArray, UseFormReturn } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "~/components/ui/form";
import { Input } from "~/components/ui/input";
import { Card, CardContent } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Product, ProductSizeStock } from "~/models/product";
import { Category } from "~/models/category";
import SelectWrapper from "../wrapper/select-wrapper";
import { ColorPicker } from "../ui/color-picker";
import { ReactNode, useState } from "react";
import { Label } from "@radix-ui/react-label";
import { X } from "lucide-react";
import { Textarea } from "../ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "~/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useCategory } from "~/api/category";
import { hexColorToName } from "~/utils/color";
import {
  ProductFormValues,
  productSchema,
  usePostProduct,
} from "~/api/product";

const defaultSizeStock: ProductSizeStock = { size: "M", stock: 0 };

export interface Props {
  onSubmit?: (date: ProductFormValues) => void;
}
export interface ProductProps extends Props {
  children: ReactNode;
  afterClose: (refetch: boolean) => void;
  defaultValues?: Category;
}

export function ProductFormWrapper({ afterClose, children }: ProductProps) {
  const [open, setOpen] = useState(false);

  const { data } = useCategory();
  const { trigger, isMutating } = usePostProduct();

  const onSubmit = async (values: ProductFormValues) => {
    try {
      await trigger(values);
      setOpen(false);
      afterClose(true);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="hover:cursor-pointer" onClick={() => setOpen(true)}>
          {children}
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md block sm:min-w-screen md:min-w-[60vw] min-w-[40vw]">
        <DialogHeader>
          <DialogTitle>Product</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <ProductForm
          loading={isMutating}
          onSubmit={onSubmit}
          categories={data?.items || []}
        />
      </DialogContent>
    </Dialog>
  );
}

export default function ProductForm({
  categories,
  defaultValues,
  onSubmit,
  loading,
}: {
  categories: Category[];
  defaultValues?: Product;
  onSubmit: (values: ProductFormValues) => void;
  loading?: boolean;
}) {
  const form = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValues || {
      colors: [],
    },
  });

  const { control, handleSubmit, setValue, getValues } = form;

  const {
    fields: colorFields,
    append: addColor,
    remove: removeColor,
  } = useFieldArray({
    control,
    name: "colors",
  });

  return (
    <Form {...form}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        onChange={() => {
          console.log(getValues());
        }}
        className="space-y-6"
      >
        <div className="form-inputs max-h-[80vh] grid grid-cols-2 gap-4">
          <div className="col-span-1 h-full overflow-auto">
            {/* Product Code */}
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Code</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product code" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Product Name */}
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Price */}
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="Enter price"
                      {...field}
                      onChange={(e) => {
                        field.onChange(+e.target.value);
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Category Selection */}
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <FormControl>
                    <SelectWrapper
                      {...field}
                      options={categories.map((category) => ({
                        value: category._id,
                        label: category.title,
                      }))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Description */}
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Colors & Sizes */}
          <div className="col-span-1 space-y-4 h-full overflow-auto">
            <div className="flex items-center gap-4">
              <FormLabel className="text-xl font-semibold">
                Colors & Sizes
              </FormLabel>
              <Button
                type="button"
                onClick={() =>
                  addColor({
                    color: "black",
                    hexCode: "#000000",
                    sizes: [defaultSizeStock],
                  })
                }
                size="sm"
                variant={"outline"}
              >
                Add Color
              </Button>
            </div>
            <Tabs>
              <TabsList>
                {colorFields.map((color) => (
                  <TabsTrigger key={color.id} value={color.id}>
                    {color.color}
                  </TabsTrigger>
                ))}
              </TabsList>

              {colorFields.map((color, index) => (
                <TabsContent key={color.id} value={color.id}>
                  <Card>
                    <CardContent className="py-4 relative">
                      <div className="flex justify-between">
                        <FormField
                          control={form.control}
                          name={`colors.${index}.hexCode`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Hex code</FormLabel>
                              <FormControl>
                                <ColorPicker
                                  {...field}
                                  onChange={(e) => {
                                    const hex = e.target.value;
                                    setValue(
                                      `colors.${index}.color`,
                                      hexColorToName(hex)
                                    );
                                    field.onChange(e);
                                  }}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name={`colors.${index}.color`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Color</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter HEX code"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <SizeStockForm
                        control={control}
                        colorIndex={index}
                        form={form}
                      />

                      <Button
                        type="button"
                        onClick={() => removeColor(index)}
                        variant={"ghost"}
                        className="absolute top-2 right-2"
                        size={"sm"}
                        icon
                      >
                        <X />
                      </Button>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>

        <Button type="submit" disabled={loading}>
          Confirm
        </Button>
      </form>
    </Form>
  );
}

const SizeStockForm = ({
  colorIndex,
  control,
  form,
}: {
  colorIndex: number;
  control: any;
  form: UseFormReturn<ProductFormValues>;
}) => {
  const { fields, append, remove } = useFieldArray({
    control,
    name: `colors.${colorIndex}.sizes`,
  });
  return (
    <div className="size space-y-2 mt-4">
      <Label className="font-semibold">Sizes</Label>
      <ul className="size-stock-form">
        {fields.map((size, index) => {
          return (
            <li
              key={index}
              className="size-stock-input flex justify-between gap-2 items-end"
            >
              <FormField
                control={form.control}
                name={`colors.${colorIndex}.sizes.${index}.size`}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Size</FormLabel>
                      <FormControl>
                        <Input {...field} placeholder="Enter size" />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name={`colors.${colorIndex}.sizes.${index}.stock`}
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Stock</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          placeholder="Enter stock"
                          min={0}
                          onChange={(e) => {
                            form.setValue(
                              `colors.${colorIndex}.sizes.${index}.stock`,
                              +e.target.value
                            );
                          }}
                        />
                      </FormControl>
                    </FormItem>
                  );
                }}
              />

              <Button
                size={"sm"}
                variant={"ghost"}
                onClick={() => remove(index)}
              >
                <X />
              </Button>
            </li>
          );
        })}
      </ul>
      <Button
        type="button"
        variant={"outline"}
        size={"sm"}
        onClick={() => append(defaultSizeStock)}
      >
        Add size
      </Button>
    </div>
  );
};
