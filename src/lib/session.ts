import "server-only";
import { SignJWT, jwtVerify } from "jose";
import { SessionPayload } from "~/app/lib/definitions";

const secretKey = process.env.SESSION_SECRET;
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(encodedKey);
}

export async function decrypt(
  session: string | undefined = "",
  secret = encodedKey
) {
  try {
    const result = await jwtVerify(session, secret, {
      algorithms: ["HS256"],
    });
    return result.payload;
  } catch {
    console.log("Failed to verify session");
  }
}
