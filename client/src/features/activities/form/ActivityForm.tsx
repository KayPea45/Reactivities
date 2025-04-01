import { Box, Button, Paper, Typography } from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";
import { useNavigate, useParams } from "react-router";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import {
	activitySchema,
	ActivitySchema,
} from "../../../lib/schemas/activitySchema";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "../../../app/shared/components/TextInput";
import SelectInput from "../../../app/shared/components/SelectInput";
import { categoryOptions } from "./categoryOptions";
import DateTimeInput from "../../../app/shared/components/DateTimeInput";
import LocationInput from "../../../app/shared/components/LocationInput";
// import { Activity } from "../../../lib/types";

export default function ActivityForm() {
	// We can remove the name property from the TextField component as the register function in react-hook-form will take care of it
	// Also, we type the useForm hook with the activitySchema that we created for zod validation.
	// the resolver property is put in place by react-hook-form to allow us to use another third party validation library
	// The control object is provided by the useForm hook in react-hook-form. It acts as a central manager for the form's state and validation logic. When you pass control to a custom input component, it connects that component to the form's state and enables features like validation, error handling, and value updates.
	const { reset, handleSubmit, control } = useForm<ActivitySchema>({
		resolver: zodResolver(activitySchema),
		mode: "onTouched",
	});
	const { id } = useParams();
	const { updateActivities, createActivity, activity, isLoadingActivity } =
		useActivities(id);
	const navigate = useNavigate(); // to be used in the submit handler to

	useEffect(() => {
		// this will reset the form when the activity changes and set the values of the fields to the new activity
		if (activity) {
			// our activity is flattened and we will need to set our location as an object with
			// the necessary properties
			// reset(activity) flattened..

			reset({
				...activity,
				location: {
					city: activity.city,
					venue: activity.venue,
					latitude: activity.latitude,
					longitude: activity.longitude,
				},
			});
		}
	}, [activity, reset]);

	const handleCancelActivityForm = () => {
		if (!id) {
			navigate("/activities");
		} else {
			navigate(`/activities/${id}`);
		}
	};

	// When we submit we need to flatten back our activity submitted data due to location
	// we will need to flatten location to properly fit the API schema of our Activity Dto (createActivityDto) for properties: venue, city, latitude, longitude
	const onSubmit = async (data: ActivitySchema) => {
		const { location, ...rest } = data; // rest will extract other properties
		const flattenedData = { ...rest, ...location }; // combine properties into a single object

		try {
			// Check if we have activity, then update. Else, create
			if (activity) {
				// overwrite the activity currently in our state to our flattened data from activity form and pass it to our mutate fnc
				updateActivities.mutate({...activity,...flattenedData},
					{
						onSuccess: () => navigate(`/activities/${activity.id}`),
					});

			} else {
				createActivity.mutate(
					flattenedData,
					{
						onSuccess: (id) => navigate(`/activities/${id}`),
					}
				);
			}
		} catch (error) {
			console.log(error);
		}
	};

	if (isLoadingActivity) return <Typography>Activity is loading...</Typography>;

	return (
		<Paper sx={{ borderRadius: 3, padding: 3 }}>
			<Typography variant="h5" gutterBottom color="primary">
				{activity ? "Edit Activity" : "Create Activity"}
			</Typography>
			<Box
				component="form"
				onSubmit={handleSubmit(onSubmit)}
				sx={{ display: "flex", flexDirection: "column", gap: 3 }}
			>
				{/* instead of register, we create a custom component  */}
				<TextInput label="Title" name="title" control={control} />
				<TextInput
					label="Description"
					name="description"
					control={control}
					multiline
					rows={3}
				/>
				<Box display="flex" gap={3}>
					<SelectInput
						items={categoryOptions}
						label="Category"
						name="category"
						control={control}
					/>
					<DateTimeInput label="Date" name="date" control={control} />
				</Box>

				<LocationInput
					control={control}
					label="Enter the location"
					name="location"
				/>

				<Box sx={{ display: "flex", justifyContent: "end", gap: 3 }}>
					<Button onClick={handleCancelActivityForm} color="inherit">
						Cancel
					</Button>
					<Button
						type="submit"
						color="success"
						variant="contained"
						disabled={updateActivities.isPending || createActivity.isPending}
					>
						Submit
					</Button>
				</Box>
			</Box>
		</Paper>
	);
}
