import { z } from "zod";
import { requiredString } from "../util/util";

export const activitySchema = z.object({
	// Specify the different fields in our activity
	title: requiredString("Title"),
	description: requiredString("Description"),
	category: requiredString("Category"),
	// data from the form, date is formatted as a string but we want to coerce into a date in order to properly validate
	date: z.coerce.date({
		message: "Date is required", // not sure why we need this but leave for now..
	}).min(new Date(), {message: "Date must be in the future"}),
	// Instead of separate, join together for our location field
	// city: requiredString("City"),
	// venue: requiredString("Venue"),
	location: z.object({
		city: z.string().optional(), // not gonna user for this information
		venue: requiredString("Venue"),
		latitude: z.coerce.number(),
		longitude: z.coerce.number(),
	})
});

// use zod and infer the type of activitySchema above so that we can use in useForm hook in ActivityForm.tsx
export type ActivitySchema = z.infer<typeof activitySchema>;
