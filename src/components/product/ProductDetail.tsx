"use client";

import Image from "next/image";
import React, { useEffect, useState } from "react";
import { cn } from "~/lib/utils";
import { Product } from "~/types/product";
import ColorBox from "../ui/color-box";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel } from "../ui/form";
import { Input } from "../ui/input";
import axiosClient from "~/lib/axios";
import { ICart } from "~/types/cart";
import useSWRMutation from "swr/mutation";
import { useToast } from "~/hooks/use-toast";
import { ToastAction } from "../ui/toast";

export const itemSchema = z.object({
  product: z.string().min(1, "Product is required"),
  size: z.string().min(1, "Size is required"),
  color: z.string().optional(),
  quantity: z.number().min(1, "Quantity must be at least 1"),
});

export type ItemFormValues = z.infer<typeof itemSchema>;

function ProductDetail({
  productData,
  userId,
}: {
  productData: Product;
  userId: string;
}) {
  const form = useForm<ItemFormValues>({
    resolver: zodResolver(itemSchema),
    defaultValues: {
      product: productData._id,
      color: productData.colors[0].color,
      size: "",
      quantity: 0,
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    watch,
    formState: { errors },
  } = form;

  const { toast } = useToast();
  const color = watch("color");
  const size = watch("size");
  const quantity = watch("quantity");

  const pColor = productData.colors.find((e) => e.color === color);
  const imgs = pColor?.imgUrls || [];
  const pSize = pColor?.sizes.find((e) => e.size.toString() === size);

  const valid = (pSize?.stock || 0) > 0 && quantity <= (pSize?.stock || 0);

  const { trigger, isMutating } = useSWRMutation<
    ICart,
    any,
    string,
    ItemFormValues
  >(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/user/addItem/${userId}`,
    async (key: string, { arg }: { arg: ItemFormValues }) => {
      return axiosClient.post<ICart>(key, arg).then((res) => res.data);
    }
  );
  const onSubmit = async (values: ItemFormValues) => {
    try {
      await trigger(values);
      toast({
        title: "Added to your cart",
        description: `Color: ${values.color}, Size: ${values.size}, Quantity: ${values.quantity}`,
        action: <ToastAction altText="Check cart">Check cart</ToastAction>,
      });
    } catch {
      toast({
        title: "Failed",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    setValue("size", "");
    setValue("quantity", 1);
  }, [color, setValue]);

  useEffect(() => {
    console.log("errors", errors);
  }, [errors]);

  return (
    <div id="productDetail" className="grid grid-cols-3 gap-8">
      <div className="col-span-2">
        <ImgBlock imgs={imgs} />
      </div>
      <div className="col-span-1">
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)}>
            <h4 className="font-semibold">{productData.title}</h4>

            <FormLabel>Colour</FormLabel>
            <div className="flex color gap-2">
              {productData.colors.map((prod) => (
                <ColorBox
                  key={prod.hexCode}
                  color={prod.hexCode}
                  onClick={() => setValue("color", prod.color)}
                  active={getValues("color") === prod.color}
                />
              ))}
              <input hidden {...register("color")} />
            </div>

            <FormField
              control={form.control}
              name="size"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sizes</FormLabel>
                  <div className="flex color gap-2">
                    <ToggleGroup
                      type="single"
                      variant={"outline"}
                      {...field}
                      onValueChange={(e) => setValue("size", e)}
                    >
                      {pColor?.sizes.map((prod) => (
                        <ToggleGroupItem
                          key={prod.size}
                          value={prod.size.toString()}
                        >
                          {prod.size}
                        </ToggleGroupItem>
                      ))}
                    </ToggleGroup>
                  </div>
                </FormItem>
              )}
            />
            {
              <small
                className={cn("mt-2", size && color ? "block" : "opacity-0")}
              >{`${pSize?.stock || 0} products left`}</small>
            }

            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <Input
                    disabled={!size}
                    type="number"
                    {...field}
                    className="w-24"
                    onChange={(e) => setValue("quantity", +e.target.value)}
                  />
                </FormItem>
              )}
            />

            <section className="py-4">
              <Button type="submit" disabled={isMutating || !valid}>
                <Plus /> Add to Cart
              </Button>
            </section>
          </form>
        </Form>
      </div>
    </div>
  );
}

const ImgBlock = ({ imgs }: { imgs: string[] }) => {
  const [selectedImg, setSelectedImg] = useState<number>(0);

  useEffect(() => {
    setSelectedImg(0);
  }, [imgs]);

  return (
    <div className="flex gap-4">
      <div className="img-list flex flex-col gap-4">
        {imgs.map((img, index) => {
          return (
            <div
              key={img}
              className={cn(
                "border border-transparent",
                index === selectedImg
                  ? "border-muted-foreground"
                  : "cursor-pointer hover:border-muted-foreground"
              )}
              onMouseOver={() => setSelectedImg(index)}
            >
              <Image src={img} alt={img} width={200} height={200} />
            </div>
          );
        })}
      </div>
      <Image
        src={imgs[selectedImg]}
        alt={imgs[selectedImg]}
        width={600}
        height={600}
      />
    </div>
  );
};

export default ProductDetail;
