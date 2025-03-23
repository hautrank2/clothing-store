import { JWT } from "next-auth/jwt";
import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { decrypt, encrypt } from "~/lib/session";
import { userService } from "~/services/userService";
import { IUser } from "~/types/user";

const MAX_AGE = +(process.env.NEXTAUTH_MAXAGE || 10);
export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  session: {
    strategy: "jwt",
    maxAge: MAX_AGE,
  },
  secret: process.env.NEXTAUTH_SECRET,
  jwt: {
    maxAge: MAX_AGE,
    encode: async (params) => {
      const { token } = params;
      try {
        const user = (await userService.findByFilter({ email: token?.email }))
          .data;
        console.log("endcode", user);
        return await encrypt({
          ...user,
          name: token?.name || "",
          email: token?.email || "",
        });
      } catch {
        // Nếu không tìm thấy user, vẫn mã hóa với name + email có sẵn
        return await encrypt({
          name: token?.name || "",
          email: token?.email || "",
        });
      }
    },
    async decode(params): Promise<JWT | null> {
      // params = {
      //   token: string;
      //   secret: string;
      // }
      const decrypted = await decrypt(params.token);
      return decrypted || null;
    },
  },
  callbacks: {
    async signIn(data) {
      const { email } = data.user;
      try {
        const exist = await userService.findByFilter({ email });
        if (exist) {
          return true;
        }
        await userService.signupByEmail(email || "");
        return true;
      } catch (err) {
        console.log(err);
      }
      return false;
    },
    jwt({ token, user, account, ...rest }) {
      console.log("callbacks token", token, user, account, rest);
      return token;
    },
    async session({ session, token, ...rest }) {
      console.log("callbacks session", session, token, rest);
      session.user = token as IUser & JWT;
      return session;
    },
  },
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
