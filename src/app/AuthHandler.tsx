"use client";

import React, { useEffect } from "react";
import { IUser } from "~/types/user";

function AuthHandler({ userData }: { userData?: IUser }) {
  useEffect(() => {
    localStorage.setItem("userData", JSON.stringify(userData));
  }, [userData]);
  return <div className="hidden"></div>;
}

export default AuthHandler;
