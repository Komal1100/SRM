"use server"
import { cookies } from "next/headers";
import { verifyToken } from "./jwt";

export const getAuthUser = async() : Promise<AuthUser | null> => {
  const token =  (await cookies()).get("auth_token")?.value;

  if (!token) return null;

  try {
    return await verifyToken(token) as AuthUser;
  } catch {
    return null;
  }
};
