import { jwtVerify } from "jose";
export async function verifyJwt(token: string) {
  const secret = new TextEncoder().encode(process.env.AUTH_JWT_SECRET!);
  try {
    const { payload } = await jwtVerify(token, secret, {
      audience: process.env.AUTH_AUDIENCE || "urn:example:audience",
      issuer: process.env.AUTH_ISSUER || "urn:example:issuer",
    });
    return payload;
  } catch (error) {
    console.error(error);
    return null;
  }
}
