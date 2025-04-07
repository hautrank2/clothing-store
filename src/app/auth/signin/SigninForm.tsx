"use client";

import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "~/components/ui/form";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

const loginSchema = z.object({
  username: z.string(),
  password: z.string().min(6, { message: "Mật khẩu tối thiểu 6 ký tự" }),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function SigninForm({ prePathname }: { prePathname: string }) {
  const [loading, setLoading] = useState(false);
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });
  const onSubmit = async (data: LoginFormValues) => {
    try {
      const api = await signIn("credentials", {
        ...data,
        callbackUrl: prePathname,
      });
      console.log(api);
    } catch {}
  };

  const onSigninByGoogle = () => {
    try {
      setLoading(true);
      signIn("google", { callbackUrl: prePathname });
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  const commonProps = {
    disabled: loading,
  };
  return (
    <Card className="max-w-md shadow-lg m-auto min-w-[30rem]">
      <CardHeader>
        <CardTitle className="text-2xl">Sign in</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input
                      {...commonProps}
                      placeholder="hautrank2"
                      {...field}
                    />
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
                      {...commonProps}
                      type="password"
                      placeholder="••••••••"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button {...commonProps} type="submit" className="w-full">
              Sign In
            </Button>
          </form>
        </Form>
        <div className="w-full mt-4 flex justify-between items-center">
          <Link href={"/forgotpassword"} className="text-end hover:underline">
            Forgot password ?
          </Link>
          <Link href={"/auth/signup"} className="text-end hover:underline">
            Create a new account ?
          </Link>
        </div>
        <Button
          variant={"outline"}
          className="w-full mt-4"
          onClick={onSigninByGoogle}
        >
          <Image
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png"
            alt="google icon"
            width={20}
            height={20}
          />
          Sign in by Google
        </Button>
      </CardContent>
    </Card>
  );
}
