import jwt from "jsonwebtoken";
import { cookies } from "next/headers";


const JWT_SECRET = process.env.JWT_SECRET!

export const signToken = (payload : AuthUser) => {
    return jwt.sign(payload , JWT_SECRET ,{expiresIn : "1d"})
};

export const verifyToken = async (token : string) => {
    return jwt.verify(token , JWT_SECRET);
}