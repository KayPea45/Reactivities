// import { useStore } from "../../../app/stores/store";
// import { observer } from "mobx-react-lite";
// import { useEffect } from "react";
// import LoadingComponents from "../../../app/layout/LoadingComponents";
import { Grid2 } from "@mui/material";
import ActivityList from "./ActivityList";
import ActivitiesFilter from "./ActivitiesFilter";

export default function ActivitiesDashboard() {
	// const { activityStore } = useStore();
	// const { loadActivities, activityRegistry } = activityStore;

	// useEffect(() => {
	// 	if (activityRegistry.size <= 1) loadActivities();
	// }, [activityStore, loadActivities, activityRegistry.size]);

	// if (activityStore.loadingInitial)
	// 	return <LoadingComponents content="Loading app..." />;

	return (
		<Grid2 container spacing={3}>
			<Grid2 size={8} /* 12 column grid is whole width and want only 7/12 */>
				<ActivityList />
			</Grid2>
			<Grid2 size={4} /* other column space we want 5 column grid width*/>
				<ActivitiesFilter />
			</Grid2>
		</Grid2>
	);
}
