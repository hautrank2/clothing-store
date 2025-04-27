import { getServerSession } from "next-auth";
import React from "react";
import { authOptions } from "../api/auth/[...nextauth]/route";
import { UserForm } from "~/components/user/UserForm";
import { Card } from "~/components/ui/card";

type Props = {};

async function ProfilePage({}: Props) {
  const session = await getServerSession(authOptions);
  return (
    <Card className="py-10 px-4">
      {session && <UserForm userData={session.user} />}
    </Card>
  );
}

export default ProfilePage;
