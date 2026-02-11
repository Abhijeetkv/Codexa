import jwt, { Secret, SignOptions } from "jsonwebtoken";

const JWT_SECRET: Secret = process.env.JWT_SECRET as Secret;

const signOptions: SignOptions = {
  expiresIn: "7d", 
};

export function signJwt(payload: object): string {
  return jwt.sign(payload, JWT_SECRET, signOptions);
}

export function verifyJwt(token: string) {
  return jwt.verify(token, JWT_SECRET);
}
