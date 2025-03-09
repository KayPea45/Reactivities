// import { useState, useEffect } from "react";
// import { useStore } from "../../../app/stores/store";
// import { observer } from "mobx-react-lite";
// import { useParams } from "react-router-dom";
// import LoadingComponent from "../../../app/layout/LoadingComponents";
// import { Activity } from "../../../app/models/activity"

import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { FormEvent } from "react";
import { useActivities } from "../../../lib/hooks/useActivities";
import { useNavigate, useParams } from "react-router";

export default function ActivityForm() {
	const { id } = useParams();
	const { updateActivities, createActivity, activity, isLoadingActivity } =
		useActivities(id);
	const navigate = useNavigate(); // to be used in the submit handler to navigate to the activity details page

	// const {
	// 	selectedActivity,
	// 	loadActivity,
	// 	// createActivity,
	// 	// updateActivity,
	// 	// loading,
	// 	loadingInitial,
	// } = activityStore;

	// const [activity, setActivity] = useState<Activity>({
	// 	id: "",
	// 	title: "",
	// 	category: "",
	// 	description: "",
	// 	date: "",
	// 	city: "",
	// 	venue: "",
	// });

	// const { id } = useParams();
	// const navigate = useNavigate();

	// useEffect hook to update the state when selectedActivity changes
	// useEffect(() => {
	// 	if (id) {
	// 		loadActivity(id).then(() => setActivity(selectedActivity!));
	// 	}
	// }, [loadActivity, id, selectedActivity]);

	// if (loadingInitial) return <LoadingComponent />;

	// function handleSubmit() {
	// 	// console.log(activity);
	// 	if (activity.id) {
	// 		updateActivity(activity).then(() => { navigate(`/activities/${activity.id}`); });;
	// 	} else {
	// 		activity.id = uuid(); // we generate the guid on the client side
	// 		createActivity(activity).then(() => { navigate(`/activities/${activity.id}`); });
	// 	}
	// }

	// function handleInputChange(
	// 	event: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
	// ) {
	// 	const { name, value } = event.target;
	// 	setActivity({ ...activity, [name]: value });
	// }

	const handleCancelActivityForm = () => {
		if (!id) {
			navigate("/activities");
		} else {
			navigate(`/activities/${id}`);
		}
	};

	const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault(); // prevent default behavior of form submission

		const formData = new FormData(event.currentTarget); // get form data from event

		console.log(formData);
		const data: { [key: string]: FormDataEntryValue } = {};
		formData.forEach((value, key) => {
			// key is the name of the input
			data[key] = value;
		});
		if (activity) {
			data.id = activity.id;
			await updateActivities.mutateAsync(data as unknown as Activity);
			navigate(`/activities/${activity.id}`);
		} else {
			createActivity.mutateAsync(data as unknown as Activity, {
				// call back function that runs after the mutation is successful
				// NOTE: onSuccess is from the useMutation hook
				onSuccess: (id: string) => {
					navigate(`/activities/${id}`);
				},
			});
		}
	};

	if (isLoadingActivity) return <Typography>Activity is loading...</Typography>;

	return (
		<Paper sx={{ borderRadius: 3, padding: 3 }}>
				<Typography variant="h5" gutterBottom color="primary">
					{activity ? "Edit Activity": "Create Activity"}
				</Typography>
			<Box
				component="form"
				onSubmit={(e) => handleSubmit(e)}
				sx={{ display: "flex", flexDirection: "column", gap: 3 }}
			>
				<TextField name="title" label="Title" defaultValue={activity?.title} />
				<TextField
					name="description"
					label="Description"
					defaultValue={activity?.description}
					multiline
					rows={3}
				/>
				<TextField
					name="category"
					label="Category"
					defaultValue={activity?.category}
				/>
				<TextField
					name="date"
					type="date"
					defaultValue={
						activity?.date
							? new Date(activity.date).toISOString().split("T")[0]
							: new Date().toISOString().split("T")[0]
					}
				/>
				<TextField name="city" label="City" defaultValue={activity?.city} />
				<TextField name="venue" label="Venue" defaultValue={activity?.venue} />
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
