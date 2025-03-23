import React from "react";
import Header from "~/components/layouts/Header";
import SigninForm from "./SigninForm";
import { headers } from "next/headers";

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
      <Header />
      <div className="bg-foreground/10 pt-16 h-screen flex justify-center items-center">
        <SigninForm prePathname={prevPath} />
      </div>
    </div>
  );
}

export default LoginPage;
