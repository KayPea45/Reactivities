import { z } from "zod";
import { requiredString } from "../util/util";

export const registerSchema = z.object({
   email: z.string().email(),
   displayName: requiredString('Display name'),
   password: requiredString('Password') // Validated in the backend so message will come from there
})

export type RegisterSchema = z.infer<typeof registerSchema>;