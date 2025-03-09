import { Box, Typography } from "@mui/material";
import ActivityCard from "./ActivityCard";
import { useActivities } from "../../../lib/hooks/useActivities";
// import { useStore } from "../../../app/stores/store";
// import { observer } from "mobx-react-lite";

export default function ActivityList() {

	// Retrieve activities from our custom Hook
	const { activities, isPending } = useActivities();

	if (!activities || isPending) return <Typography>Loading...</Typography>;
	return (
		<Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
			{/* NOTE: we use => {} curly braces when we need to return something
			Else, we use the () brackets */}
			{activities.map(activity => (
				<ActivityCard key={activity.id} activity={activity} />
			))}
		</Box>
	);
};
