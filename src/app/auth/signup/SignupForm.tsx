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

const formSchema = z
  .object({
    username: z
      .string()
      .min(1, "Username is required")
      .max(20, "Username is too long"),
    email: z.string().email("Invalid email"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")
      .max(50, "Password is too long"),
    confirmPassword: z.string(),
    phone: z.string().optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match",
  });

export type RegisterFormData = z.infer<typeof formSchema>;

export function SignupForm() {
  const form = useForm<RegisterFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    console.log("📦 Form submitted:", data);
  };

  const onSignupByGoogle = () => {
    try {
      signIn("google", { callbackUrl: "/" });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-w-md mx-auto rounded-xl min-w-[30rem]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Phone</FormLabel>
                <FormControl>
                  <Input placeholder="0123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
        </form>
      </Form>
    </div>
  );
}
