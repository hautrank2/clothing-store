import React from "react";
import Header from "~/components/layouts/Header";
import SigninForm from "./SigninForm";
import { headers } from "next/headers";
import { cn } from "~/lib/utils";

async function LoginPage({}) {
  const headerList = await headers();
  const referer = headerList.get("referer");
  const path = headerList.get("path") || "";
  const authority = headerList.get("authority") || "";
  // Check if referer is internal page return referer, else return Home page
  let prevPath =
    referer && referer.startsWith(process.env.NEXTAUTH_URL || "")
      ? referer
      : "/";
  // Check prePath is auth patname return "/"
  if (referer?.startsWith(authority.concat(path))) prevPath = "/";

  return (
    <div id="loginPage">
      <Header theme={"light"} className="bg-transparent border-b-0" />
      <div
        className={cn(
          "pt-16 h-screen flex justify-center items-center",
          "bg-[url(/img/banner/login-bg.jpg)] bg-cover bg-origin-padding bg-no-repeat bg-fixed bg-left"
        )}
      >
        <div
          className={cn(
            "-translate-y-20 xl:translate-y-0",
            "xl:absolute xl:right-60 xl:top-[50%] xl:-translate-y-1/2"
          )}
        >
          <SigninForm prePathname={prevPath} />
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
