import { optional, z } from "zod";
import { requiredString } from "../util/util";

export const editProfileSchema = z.object({
   // Specify the different fields in our edit profile
   displayName: requiredString("Display Name"),
   bio: optional(z.string()).or(z.literal("")), // bio is optional and can be an empty string
});

// use zod and infer the type of editProfile schema above so that we can use in useForm hook in EditProfile.tsx
export type EditProfileSchema = z.infer<typeof editProfileSchema>;