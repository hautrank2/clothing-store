import { JWT as DefaultJWT } from "next-auth/jwt";
import type { Session as DefaultSession } from "next-auth";
import { IUser } from "./user";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface JWT extends IUser, DefaultJWT {}

  interface Session extends DefaultSession {
    user: IUser & DefaultJWT;
  }
}
