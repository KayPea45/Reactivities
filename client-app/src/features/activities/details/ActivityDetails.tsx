// import { useStore } from "../../../app/stores/store";
// import { useParams } from "react-router-dom";
// import { observer } from "mobx-react-lite";
// import { useEffect } from "react";
// import LoadingComponent from "../../../app/layout/LoadingComponents";

import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { Activity } from "../../../app/models/activity";

type Props = {
	activity: Activity;
	cancelSelectActivity: () => void;
	handleEditMode: (editMode: boolean) => void;
}

export default function ActivityDetails({activity, cancelSelectActivity, handleEditMode}: Props) {
	// const { activityStore } = useStore();
	// const {
	// 	selectedActivity: activity,
	// 	loadActivity,
	// 	loadingInitial,
	// } = activityStore;
	// const { id } = useParams(); // useParams is a hook that returns an object of key/value pairs of URL parameters. Use it to access match.params of the current <Route>.

	// useEffect hook to load the activity when the ActivityDetails component mounts
	// useEffect(() => {
	// 	if (id) loadActivity(id);
	// }, [id, loadActivity]);
	// NOTE: The second argument of the useEffect hook is an array of dependencies. If the dependencies change, the effect will run again. If the dependencies are empty, the effect will only run once when the component mounts.

	// if (!activity || loadingInitial) return <LoadingComponent />;

	return (
		<Card sx={{borderRadius: 3}}>
			<CardMedia
			 	component='img'
				src={`/images/categoryImages/${activity.category}.jpg`}
			 />
			 <CardContent>
				<Typography variant="h5">{activity.title}</Typography>
				<Typography variant="subtitle1" fontWeight='light'>{activity.date}</Typography>
				<Typography variant="body1">{activity.description}</Typography>
			 </CardContent>
			 <CardActions>
				<Button color="primary" onClick={() => handleEditMode(true)}>Edit</Button>
				<Button onClick={cancelSelectActivity} color="inherit">Cancel</Button>
			 </CardActions>
		</Card>
	);
};
