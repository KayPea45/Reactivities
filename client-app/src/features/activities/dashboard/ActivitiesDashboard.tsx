// import { useStore } from "../../../app/stores/store";
// import { observer } from "mobx-react-lite";
// import { useEffect } from "react";
// import LoadingComponents from "../../../app/layout/LoadingComponents";
import { Grid2 } from "@mui/material";
import { Activity } from "../../../app/models/activity";
import ActivityList from "./ActivityList";
import ActivityDetails from "../details/ActivityDetails";
import ActivityForm from "../form/ActivityForm";

// Not for Mobx
// In App.tsx, we include this component (ActivitiesDashboard) and need to pass in props
// for the activities we get from API call in App.tsx.
// But we need to define a property to hold Activity type thus creating an interface.
type Props = {
	activities: Activity[];
	selectActivity: (id: string) => void;
	cancelSelectActivity: () => void;
	selectedActivity?: Activity;
	editMode: boolean;
	handleEditMode: (editMode: boolean) => void;
	submitForm: (activity: Activity) => void;
	deleteActivity: (id: string) => void;
};

// We make ActivitiesDashboard an observer component to listen to any changes in the store (the properties - selectedActivity, editMode). Any other properties that are not used in the component and is changed will not re-render again.
export default function ActivitiesDashboard({
	activities,
	selectActivity,
	selectedActivity,
	cancelSelectActivity,
	editMode,
	handleEditMode,
	submitForm,
	deleteActivity,
}: Props) {
	// const { activityStore } = useStore();
	// const { loadActivities, activityRegistry } = activityStore;

	// useEffect(() => {
	// 	if (activityRegistry.size <= 1) loadActivities();
	// }, [activityStore, loadActivities, activityRegistry.size]);

	// if (activityStore.loadingInitial)
	// 	return <LoadingComponents content="Loading app..." />;

	return (
		<Grid2 container spacing={3}>
			<Grid2 size={7} /* 12 column grid is whole width and want only 7/12 */>
				<ActivityList activities={activities} selectActivity={selectActivity} deleteActivity={deleteActivity} />
			</Grid2>
			<Grid2 size={5} /* other column space we want 5 column grid width*/>
				{selectedActivity && !editMode && (
					<ActivityDetails
						activity={selectedActivity}
						cancelSelectActivity={cancelSelectActivity}
						handleEditMode={handleEditMode}
					/>
				)}
				{editMode && (
					<ActivityForm
						activity={selectedActivity}
						handleEditMode={handleEditMode}
						submitForm={submitForm}
					/>
				)}
			</Grid2>
		</Grid2>
	);
}
