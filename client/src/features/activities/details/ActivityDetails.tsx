// import { useStore } from "../../../app/stores/store";
// import { useParams } from "react-router-dom";
// import { observer } from "mobx-react-lite";
// import { useEffect } from "react";
// import LoadingComponent from "../../../app/layout/LoadingComponents";

import { Button, Card, CardActions, CardContent, CardMedia, Typography } from "@mui/material";
import { Link, useNavigate, useParams } from "react-router";
import { useActivities } from "../../../lib/hooks/useActivities";

export default function ActivityDetails() {
	// A way we can use hook from React Router to navigate to a different page
	// Alternatively, we can use way we did in NavBar.tsx
	const navigate = useNavigate();
	const {id} = useParams();
	const {activity, isLoadingActivity} = useActivities(id);

	if (isLoadingActivity) return <Typography>Activity is loading...</Typography>

	if (!activity) return <Typography>Activity is not found!</Typography>
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
				<Button color="primary" component={Link} to={`/manage/${activity.id}`} >Edit</Button>
				<Button onClick={() => navigate('/activities')} color="inherit">Cancel</Button>
			 </CardActions>
		</Card>
	);
};
