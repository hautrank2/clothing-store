import React from "react";

function SignupLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="signup-page h-screen flex justify-center items-center">
      {children}
    </div>
  );
}

export default SignupLayout;
