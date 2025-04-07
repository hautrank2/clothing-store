"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import React, { useEffect, useMemo, useState } from "react";
import { useFieldArray, useForm, UseFormSetError } from "react-hook-form";
import useSWR from "swr";
import { Button } from "~/components/ui/button";
import { Checkbox } from "~/components/ui/checkbox";
import ColorBox from "~/components/ui/color-box";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "~/components/ui/form";
import { QuantityInput } from "~/components/ui/quantity-input";
import { Skeleton } from "~/components/ui/skeleton";
import axiosClient from "~/lib/axios";
import { cn } from "~/lib/utils";
import { ICart, Item, ItemFormValues } from "~/types/cart";
import { orderFormSchema, OrderFormValues } from "~/types/order";
import { Product, ProductColor, ProductSizeStock } from "~/types/product";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { IUser } from "~/types/user";
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group";
import { Address, AddressFormValues } from "~/types/address";
import AddressInfo from "~/components/address/AddressInfo";
import { Input } from "~/components/ui/input";
import { useToast } from "~/hooks/use-toast";

type Props = {
  user: IUser;
};

function CartForm({ user }: Props) {
  const { toast } = useToast();
  const userId = user._id;
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      user: userId,
      items: [],
      shippingFee: 0,
      totalPrice: 0,
      phone: user.phone || "",
      address: user.address?.[0] || {},
    },
  });

  const { setValue, watch, control, setError, getValues, formState } = form;

  const { errors, isValid } = formState;

  const itemsFormArray = useFieldArray({
    control,
    name: "items",
  });
  const totalPrice = watch("totalPrice");
  const address = watch("address");
  const { fields: items } = itemsFormArray;

  const { data, isLoading, mutate } = useSWR<ICart>(
    `${process.env.NEXT_PUBLIC_API_ENDPOINT}/user/cart/${userId}`,
    (url: string) => axiosClient(url).then((e) => e.data)
  );

  useEffect(() => {
    mutate();
  }, [mutate]);

  useEffect(() => {
    console.log("error", errors);
  }, [JSON.stringify(errors)]);

  const onSubmit = async (values: OrderFormValues) => {
    try {
      await axiosClient.post(
        `${process.env.NEXT_PUBLIC_API_ENDPOINT}/order`,
        values
      );
      toast({
        title: "Order created",
        description: "Your order has been created successfully.",
      });
      mutate();
      form.reset();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create order.",
        variant: "destructive",
      });
    }
  };

  const onChangeSelect = (index: number, newValue: boolean, item: Item) => {
    if (newValue) {
      itemsFormArray.append({
        ...item,
        product: item.product._id,
      });
    } else {
      itemsFormArray.remove(index);
    }

    calculateTotal();
  };

  const calculateTotal = () => {
    const total = items.reduce((acc, curr) => {
      const productData = data?.items.find(
        (item) => item.product._id === curr.product
      );
      return acc + curr.quantity * (productData?.product?.price ?? 0);
    }, 0);

    setValue("totalPrice", total);
  };

  useEffect(() => {
    calculateTotal();
  }, [JSON.stringify(getValues())]);

  useEffect(() => {
    console.log(address);
  }, [address]);

  return (
    <div className="relative">
      {isLoading ? (
        <div className="flex flex-col loading gap-4 gap-8">
          {Array.from({ length: 4 }, (_, i) => i).map((_, i) => {
            return (
              <div key={i} className="flex gap-8 h-20">
                <Skeleton className="w-24 h-24 rounded-full" />
                <div className="flex flex-[2] gap-2 flex-col">
                  <Skeleton className="w-full h-8 rounded-full" />
                  <Skeleton className="w-full h-8 rounded-full" />
                  <Skeleton className="w-full h-8 rounded-full" />
                </div>
              </div>
            );
          })}
        </div>
      ) : !data ? (
        <div className="mt-8">
          <h4>No items in your cart</h4>
        </div>
      ) : (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <div
              className={cn(
                "container px-8 py-4 w-full rounded shadow-lg border fixed inset-x-0 bottom-2",
                "flex flex-col gap-2"
              )}
            >
              <div className="max-w-[400px]">
                <FormField
                  control={control}
                  name="phone"
                  render={({ field }) => {
                    return (
                      <FormItem className="flex flex-row items-center gap-2">
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter your phone number"
                            className="mt-0"
                            {...field}
                          />
                        </FormControl>
                      </FormItem>
                    );
                  }}
                />
              </div>
              <div className="flex justify-between">
                <h3>
                  Total: <span className="font-bold">${totalPrice}</span>
                </h3>
                <Button size={"lg"} disabled={!isValid}>
                  Buy
                </Button>
              </div>
            </div>

            <Tabs defaultValue="items" className="w-full">
              <TabsList>
                <TabsTrigger value="items">Items</TabsTrigger>
                <TabsTrigger value="info">Address</TabsTrigger>
              </TabsList>
              <TabsContent value="items">
                <ul className="flex flex-col gap-4 pt-4">
                  {data.items.map((item, index) => {
                    const selectIndex = items.findIndex(
                      (i) =>
                        i.product === item.product._id &&
                        i.size === item.size &&
                        i.color === item.color
                    );

                    const productSizeStock = getProductSizeStock(
                      item,
                      item.product
                    );

                    const isSelect = selectIndex !== -1;
                    const field = items[selectIndex];
                    return (
                      <li
                        key={item.color + index}
                        className="shadow-lg border rounded"
                      >
                        <ItemCard
                          indexItem={selectIndex}
                          field={field}
                          item={item}
                          select={isSelect}
                          onChangeSelect={() =>
                            onChangeSelect(selectIndex, !isSelect, item)
                          }
                          setError={setError}
                          productSizeStock={productSizeStock}
                          onChangeQuantity={(quantity) => {
                            isSelect &&
                              itemsFormArray.update(selectIndex, {
                                ...field,
                                quantity,
                              });
                          }}
                        />
                      </li>
                    );
                  })}
                </ul>
              </TabsContent>
              <TabsContent value="info">
                <div className="pt-4">
                  <FormField
                    control={control}
                    name="address"
                    render={({ field }) => {
                      return (
                        <AddressCards
                          value={field.value}
                          onChange={(values) => setValue("address", values)}
                          data={user.address ?? []}
                        />
                      );
                    }}
                  />
                </div>
              </TabsContent>
            </Tabs>
          </form>
        </Form>
      )}
    </div>
  );
}

const ProductImgs = ({ pColor }: { pColor: ProductColor }) => {
  const [i, setI] = useState(0);
  return (
    <div
      className="w-full h-full relative"
      onMouseMove={() => setI(1)}
      onMouseLeave={() => setI(0)}
    >
      {pColor.imgUrls.map((imgUrl, ix) => {
        const img = process.env.NEXT_PUBLIC_ASSET_PREFIX + imgUrl;
        return (
          <Image
            key={img + ix}
            alt={img}
            src={img}
            fill
            sizes="100%"
            className={cn(i === ix ? "opacity-1" : "opacity-0")}
          />
        );
      })}
    </div>
  );
};

const AddressCards = ({
  value,
  onChange,
  data,
}: {
  data: Address[];
  value: AddressFormValues;
  onChange: (values: AddressFormValues) => void;
}) => {
  const index = value
    ? data.findIndex(
        (add) =>
          !Object.entries(add).some(([key, v]) => {
            return key in value && v !== value[key as keyof AddressFormValues];
          })
      )
    : -1;

  return (
    <div className="flex">
      <RadioGroup
        onValueChange={(value) => onChange(data[Number(value)])}
        value={index.toString()}
        className="w-full"
      >
        <div className="flex flex-col gap-2">
          {data.map((add, ix) => (
            <div key={ix} className="flex gap-4 items-center">
              <RadioGroupItem value={ix.toString()} />
              <div className="w-full">
                <AddressInfo address={add} disableEdit />
              </div>
            </div>
          ))}
        </div>
      </RadioGroup>
    </div>
  );
};

const ItemCard = ({
  indexItem,
  field,
  item,
  select,
  onChangeSelect,
  productSizeStock,
  onChangeQuantity,
  setError,
}: {
  indexItem: number;
  field: ItemFormValues | null;
  item: Item;
  select: boolean;
  onChangeSelect: () => void;
  onChangeQuantity: (n: number) => void;
  productSizeStock?: ProductSizeStock | null;
  setError: UseFormSetError<OrderFormValues>;
}) => {
  const data = useMemo(() => {
    return {
      ...item,
      ...field,
      product: item.product,
    };
  }, [field, item]);
  const pColor = item.product.colors.find(
    (pColor) => pColor.color === item.color
  );

  useEffect(() => {
    if (field && productSizeStock && indexItem !== -1) {
      if (field.quantity > productSizeStock.stock) {
        setError(`items.${indexItem}.quantity`, {
          type: "max",
          message: "Over stock",
        });
      }
    }
  }, [field, indexItem, productSizeStock, setError]);

  return (
    <div className="flex">
      <div className="self-center px-8">
        <Checkbox
          className="w-10 h-10"
          checked={select}
          onCheckedChange={onChangeSelect}
        />
      </div>
      <div className="h-40 w-40">
        {pColor && <ProductImgs pColor={pColor} />}
      </div>
      <div className="flex-1 pt-2 px-4">
        <h4 className="font-semibold">{data.product.title}</h4>

        <div className="py-px flex border-border/80 border-b items-center">
          <div className="flex-[1]">
            <p>Size:</p>
          </div>
          <div className="flex-[4]">
            <p>{data.size}</p>
          </div>
        </div>

        <div className="py-px flex border-border/80 border-b items-center">
          <div className="flex-[1]">
            <p>Color:</p>
          </div>
          <div className="flex-[4] flex items-center gap-2">
            <p>{data.color}</p>
            <ColorBox color={pColor?.hexCode || ""} className="h-4 w-4" />
          </div>
        </div>

        <div className="py-px flex border-border/80 border-b items-center">
          <div className="flex-[1]">
            <p>Quantity:</p>
          </div>
          <div className="flex-[4] py-2 flex items-center gap-4">
            {select ? (
              <QuantityInput
                className="w-20 h-6 px-2"
                value={data.quantity}
                onValueChange={(e) => onChangeQuantity(e)}
                max={productSizeStock?.stock}
                min={1}
                disabled={!select}
              />
            ) : (
              <p>{data.quantity}</p>
            )}
            <p>Max: {productSizeStock?.stock}</p>
          </div>
        </div>

        <div className="py-px flex border-border/80 border-b items-center">
          <div className="flex-[1]">
            <p>Price:</p>
          </div>
          <div className="flex-[4]">
            <p>
              <span className="font-bold">
                ${data.quantity * data.product.price}
              </span>{" "}
              ($
              {data.product.price}/item)
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartForm;

const getProductSizeStock = (
  item: Item,
  product: Product
): ProductSizeStock | null => {
  const color = product.colors.find(
    (prod: ProductColor) => prod.color === item.color
  );
  if (!color) return null;
  return (
    color.sizes.find((size: ProductSizeStock) => size.size === item.size) ||
    null
  );
};
