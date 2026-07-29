import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const COOKIE = "ff_admin";
const TTL_SECONDS = 8 * 60 * 60; // 8h

/** True once the admin backend env vars are present. */
export function authConfigured(): boolean {
  return Boolean(
    process.env.ADMIN_USERNAME &&
      process.env.ADMIN_PASSWORD_HASH &&
      process.env.JWT_SECRET
  );
}

/** Verify username + password; return a signed JWT or null. */
export async function verifyLogin(
  username: string,
  password: string
): Promise<string | null> {
  const user = process.env.ADMIN_USERNAME;
  const hash = process.env.ADMIN_PASSWORD_HASH;
  const secret = process.env.JWT_SECRET;
  if (!user || !hash || !secret) return null;
  if (username !== user) return null;
  const ok = await bcrypt.compare(password, hash);
  if (!ok) return null;
  return jwt.sign({ role: "admin", user }, secret, { expiresIn: TTL_SECONDS });
}

export async function setAuthCookie(token: string): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: TTL_SECONDS,
    path: "/",
  });
}

export async function clearAuthCookie(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function checkAuth(): Promise<boolean> {
  const secret = process.env.JWT_SECRET;
  if (!secret) return false;
  const jar = await cookies();
  const token = jar.get(COOKIE)?.value;
  if (!token) return false;
  try {
    jwt.verify(token, secret, { algorithms: ["HS256"] });
    return true;
  } catch {
    return false;
  }
}

export async function requireAuth(): Promise<void> {
  if (!(await checkAuth())) throw new Error("Unauthorized");
}
