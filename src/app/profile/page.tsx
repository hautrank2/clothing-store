import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { UserForm } from "~/components/user/UserForm";

type Props = {};

async function ProfilePage({}: Props) {
  const session = await getServerSession(authOptions);
  return (
    <div className="py-10 px-4">
      {session && <UserForm userData={session.user} />}
    </div>
  );
}

export default ProfilePage;
