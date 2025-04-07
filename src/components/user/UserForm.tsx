import React from "react";
import { Badge } from "~/components/ui/badge";
import { IUser, RoleType } from "~/types/user"; // đảm bảo đúng path import

const UserForm = ({ userData }: { userData: IUser }) => {
  const rowClassName = "flex border-b border-border/60 py-2";

  return (
    <div>
      <div className={rowClassName}>
        <div className="flex-[1] font-medium text-muted-foreground">
          Username:
        </div>
        <div className="flex-[2]">{userData.username}</div>
      </div>

      <div className={rowClassName}>
        <div className="flex-[1] font-medium text-muted-foreground">Name:</div>
        <div className="flex-[2]">{userData.name || "—"}</div>
      </div>

      <div className={rowClassName}>
        <div className="flex-[1] font-medium text-muted-foreground">Email:</div>
        <div className="flex-[2]">{userData.email || "—"}</div>
      </div>

      {/* <div className={rowClassName}>
        <div className="flex-[1] font-medium text-muted-foreground">Role:</div>
        <div className="flex-[2]">
          <Badge
            variant={
              userData.role === RoleType.ADMIN ? "destructive" : "outline"
            }
          >
            {userData.role}
          </Badge>
        </div>
      </div> */}

      {/* <div className={rowClassName}>
        <div className="flex-[1] font-medium text-muted-foreground">
          Status:
        </div>
        <div className="flex-[2]">
          <Badge variant={userData.isActive ? "default" : "secondary"}>
            {userData.isActive ? "Active" : "Inactive"}
          </Badge>
        </div>
      </div> */}
    </div>
  );
};

export { UserForm };
