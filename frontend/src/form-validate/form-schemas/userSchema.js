import { z } from "zod";
import { emailSchema } from "./emailSchema";
import { passwordSchema } from "./passwordSchema";
export const userSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  name: z.string().min(2, "Name must be at least 2 characters long"),
});
