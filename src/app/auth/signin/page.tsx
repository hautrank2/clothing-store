import React from "react";
import Header from "~/components/layouts/Header";
import SigninForm from "./SigninForm";
1;
function LoginPage({}) {
  return (
    <div id="loginPage">
      <Header />
      <div className="bg-foreground/10 pt-16 h-screen flex justify-center items-center">
        <SigninForm />
      </div>
    </div>
  );
}

export default LoginPage;
