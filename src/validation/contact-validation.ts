import { z, ZodType } from "zod";

export class ContactValidation {
  static readonly CREATE: ZodType = z.object({
    first_name: z.string().min(6).max(100),
    last_name: z.string().min(6).max(100).optional(),
    email: z.email().max(100).optional(),
    phone: z.string().min(7).max(20).optional(),
  });

  static readonly GET: ZodType = z.number().int().positive();

  static readonly UPDATE: ZodType = z.object({
    id: z.number().int().positive(),
    first_name: z.string().min(6).max(100),
    last_name: z.string().min(6).max(100).optional(),
    email: z.email().max(100).optional(),
    phone: z.string().min(7).max(20).optional(),
  });
}
