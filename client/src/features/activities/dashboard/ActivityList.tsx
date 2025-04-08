import { Box, Typography } from "@mui/material";
import ActivityCard from "./ActivityCard";
import { useActivities } from "../../../lib/hooks/useActivities";
// import { useStore } from "../../../app/stores/store";
// import { observer } from "mobx-react-lite";

export default function ActivityList() {

	// Retrieve activities from our custom Hook
	const { activities, isLoading } = useActivities();

	if (isLoading) return <Typography>Loading...</Typography>;

	if (!activities) return <Typography>No Activities found</Typography>;

	return (
		<Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
			{activities.map(activity => (
				<ActivityCard key={activity.id} activity={activity} />
			))}
		</Box>
	);
};
