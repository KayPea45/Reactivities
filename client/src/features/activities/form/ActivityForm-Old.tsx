// import { Box, Button, Paper, TextField, Typography } from "@mui/material";
// import { useActivities } from "../../../lib/hooks/useActivities";
// import { useNavigate, useParams } from "react-router";
// import { useForm } from "react-hook-form";
// import { useEffect } from "react";
// import {
// 	activitySchema,
// 	ActivitySchema,
// } from "../../../lib/schemas/activitySchema";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { formatDateTime } from "../../../lib/util/util";

// export default function ActivityForm() {
// 	// We can remove the name property from the TextField component as the register function in react-hook-form will take care of it
// 	// Also, we type the useForm hook with the activitySchema that we created for zod validation.
// 	// the resolver property is put in place by react-hook-form to allow us to use another third party validation library
// 	const {
// 		register,
// 		reset,
// 		handleSubmit,
// 		formState: { errors },
// 	} = useForm<ActivitySchema>({
// 		resolver: zodResolver(activitySchema),
// 		mode: 'onTouched',
// 	});
// 	const { id } = useParams();
// 	const { updateActivities, createActivity, activity, isLoadingActivity } =
// 		useActivities(id);
// 	const navigate = useNavigate(); // to be used in the submit handler to

// 	useEffect(() => {
// 		// this will reset the form when the activity changes and set the values of the fields to the new activity
// 		if (activity) {
// 			reset(activity);
// 		}
// 	}, [activity, reset]);

// 	const handleCancelActivityForm = () => {
// 		if (!id) {
// 			navigate("/activities");
// 		} else {
// 			navigate(`/activities/${id}`);
// 		}
// 	};

// 	const onSubmit = (data: ActivitySchema) => {
// 		console.log(data);
// 	};

// 	if (isLoadingActivity) return <Typography>Activity is loading...</Typography>;

// 	return (
// 		<Paper sx={{ borderRadius: 3, padding: 3 }}>
// 			<Typography variant="h5" gutterBottom color="primary">
// 				{activity ? "Edit Activity" : "Create Activity"}
// 			</Typography>
// 			<Box
// 				component="form"
// 				onSubmit={handleSubmit(onSubmit)}
// 				sx={{ display: "flex", flexDirection: "column", gap: 3 }}
// 			>
// 				{/* register function is used in place of the name property */}
// 				<TextField
// 					{...register("title")}
// 					label="Title"
// 					defaultValue={activity?.title}
// 					error={!!errors.title}
// 					helperText={errors.title?.message}
// 				/>
// 				<TextField
// 					{...register("description")}
// 					label="Description"
// 					defaultValue={activity?.description}
// 					multiline
// 					rows={3}
// 				/>
// 				<TextField
// 					{...register("category")}
// 					label="Category"
// 					defaultValue={activity?.category}
// 				/>
// 				<TextField
// 					{...register("date")}
// 					type="date"
// 					defaultValue={
// 						activity ? formatDateTime(activity.date) : ""
// 					}
// 				/>
// 				<TextField
// 					{...register("city")}
// 					label="City"
// 					defaultValue={activity?.city}
// 				/>
// 				<TextField
// 					{...register("venue")}
// 					label="Venue"
// 					defaultValue={activity?.venue}
// 				/>
// 				<Box sx={{ display: "flex", justifyContent: "end", gap: 3 }}>
// 					<Button onClick={handleCancelActivityForm} color="inherit">
// 						Cancel
// 					</Button>
// 					<Button
// 						type="submit"
// 						color="success"
// 						variant="contained"
// 						disabled={updateActivities.isPending || createActivity.isPending}
// 					>
// 						Submit
// 					</Button>
// 				</Box>
// 			</Box>
// 		</Paper>
// 	);
// }
