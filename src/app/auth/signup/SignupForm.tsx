"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
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
import { Button } from "~/components/ui/button";
import Image from "next/image";
import { Separator } from "~/components/ui/separator";
import { signIn } from "next-auth/react";
import { useEffect } from "react";
import axiosClient from "~/lib/axios";
import { useToast } from "~/hooks/use-toast";
import { useRouter } from "next/navigation";

const formSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .max(20, "Username is too long"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password is too long"),
    confirmPassword: z.string(),
    name: z
      .string()
      .min(6, "Name must be at least 6 characters")
      .max(100, "Name is too long"),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterFormData = z.infer<typeof formSchema>;

export function SignupForm() {
  const router = useRouter();
  const { toast } = useToast();
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
      confirmPassword: "",
      phone: "",
      name: "",
    },
  });

  const { watch, setError, clearErrors } = form;
  const username = watch("username");
  const phone = watch("phone");

  const onSubmit = async (data: RegisterFormData) => {
    try {
      await axiosClient.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/user`, {
        username: data.username,
        password: data.password,
        phone: data.phone,
        name: data.name,
        role: "customer",
      });
      router.push("/auth/signin");
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong",
        variant: "destructive",
      });
    }
  };

  const onSignupByGoogle = () => {
    try {
      signIn("google", { callbackUrl: "/" });
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (username) {
        try {
          const find = await axiosClient.get(
            `${
              process.env.NEXT_PUBLIC_API_ENDPOINT
            }/user/filter?${new URLSearchParams({ username })}`
          );
          if (find.data) {
            setError("username", {
              type: "manual",
              message: "Username already exists",
            });
          } else {
            clearErrors("username");
          }
        } catch {
          clearErrors("username");
        }
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [username]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (username) {
        try {
          const find = await axiosClient.get(
            `${
              process.env.NEXT_PUBLIC_API_ENDPOINT
            }/user/filter?${new URLSearchParams({ username })}`
          );
          if (find.data) {
            setError("phone", {
              type: "manual",
              message: "Phone already exists",
            });
          } else {
            clearErrors("phone");
          }
        } catch {
          clearErrors("phone");
        }
      }
    }, 1000);

    return () => clearTimeout(timeout);
  }, [phone]);

  return (
    <div className="max-w-md mx-auto rounded-xl min-w-[30rem]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Username</FormLabel>
                <FormControl>
                  <Input placeholder="Enter username" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter name" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="Enter phone number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm Password</FormLabel>
                <FormControl>
                  <Input
                    type="password"
                    placeholder="Enter password"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit</Button>
        </form>
      </Form>
      <div className="flex items-center w-full gap-4">
        <Separator className="flex-1" />
        <h5 className="text-center">Or</h5>
        <Separator className="flex-1" />
      </div>
      <Button
        variant={"outline"}
        className="w-full mt-4"
        type="button"
        onClick={onSignupByGoogle}
      >
        <Image
          src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
          alt="google icon"
          width={20}
          height={20}
        />
        Sign up by Google
      </Button>
    </div>
  );
}
