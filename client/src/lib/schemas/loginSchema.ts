import { z } from "zod";

// login validation schema for the login form using zod
export const loginSchema = z.object({
   email: z.string().email(),
   password: z.string().min(6) 
})

// infer our loginSchema to a LoginSchema type
export type LoginSchema = z.infer<typeof loginSchema>;
