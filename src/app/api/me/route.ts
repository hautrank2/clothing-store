// app/api/me/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

// Dùng từ biến môi trường
const secret = process.env.NEXTAUTH_SECRET;

export async function GET(req: NextRequest) {
  console.log("Cookies:", req.headers.get("cookie")); // 👈 debug xem có token không
  const token = await getToken({ req, secret });
  console.log("Token:", token); // 👈 sẽ biết có đọc được token không

  if (!token) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    user: {
      id: token.sub,
      name: token.name,
      email: token.email,
      accessToken: token.accessToken,
    },
  });
}
