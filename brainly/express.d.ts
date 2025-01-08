// express.d.ts
import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string; // Add userId as an optional property
    }
  }
}
