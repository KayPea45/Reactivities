import { Box } from "@mui/material";
import { Activity } from "../../../app/models/activity";
import ActivityCard from "./ActivityCard";
// import { useStore } from "../../../app/stores/store";
// import { observer } from "mobx-react-lite";

type Props = {
	activities: Activity[];
	selectActivity: (id: string) => void;
	deleteActivity: (id: string) => void;
}

export default function ActivityList({activities, selectActivity, deleteActivity}: Props) {
	// const { activityStore } = useStore();

	return (
		<Box sx={{display: 'flex', flexDirection: 'column', gap: 3}}>
			{/* NOTE: we use => {} curly braces when we need to return something
			Else, we use the () brackets */}
			{activities.map(activity => (
				<ActivityCard key={activity.id} activity={activity} selectActivity={selectActivity} deleteActivity={deleteActivity} />
			))}
		</Box>
	);
};
