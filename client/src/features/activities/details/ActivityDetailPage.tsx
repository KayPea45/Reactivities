// import { useStore } from "../../../app/stores/store";
// import { useParams } from "react-router-dom";
// import { observer } from "mobx-react-lite";
// import { useEffect } from "react";
// import LoadingComponent from "../../../app/layout/LoadingComponents";

import { Grid2, Typography } from "@mui/material";
import { useParams } from "react-router";
import { useActivities } from "../../../lib/hooks/useActivities";
import ActivityDetailsHeader from "./ActivityDetailsHeader";
import ActivityDetailsInfo from "./ActivityDetailsInfo";
import ActivityDetailsChat from "./ActivityDetailsChat";
import ActivityDetailsSidebar from "./ActivityDetailsSidebar";
    
export default function ActivityDetailPage() {
	// A way we can use hook from React Router to navigate to a different page
	// Alternatively, we can use way we did in NavBar.tsx
	const {id} = useParams();
	const {activity, isLoadingActivity} = useActivities(id);

	if (isLoadingActivity) return <Typography>Activity is loading...</Typography>

	if (!activity) return <Typography>Activity is not found!</Typography>

	return (
		<Grid2 container spacing={3}>
			<Grid2 size={8}>
				<ActivityDetailsHeader activity={activity} />
				<ActivityDetailsInfo  activity={activity} />
				<ActivityDetailsChat />
			</Grid2>
			<Grid2 size={4}>
				<ActivityDetailsSidebar activity={activity} />
			</Grid2>
		</Grid2>
	);
};
