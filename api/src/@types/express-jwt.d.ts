declare module "express-jwt" {
  import { RequestHandler } from "express";

  interface JwtOptions {
    secret: any;
    audience?: string;
    issuer?: string;
    algorithms?: string[];
  }

  export default function jwt(options: JwtOptions): RequestHandler;
}
