import {
	Box,
	Button,
	Card,
	CardActions,
	CardContent,
	Chip,
	Typography,
} from "@mui/material";
import { useActivities } from "../../../lib/hooks/useActivities";

type Props = {
	activity: Activity;
	selectActivity: (id: string) => void;
};

export default function ActivityCard({
	activity,
	selectActivity,
}: Props) {
	const {deleteActivity} = useActivities();

	const handleDeleteActivity = async (id: string) => {
		await deleteActivity.mutateAsync(id);
	}
	
	return (
		<Card sx={{ borderRadius: 3 }}>
			<CardContent>
				<Typography variant="h5">{activity.title}</Typography>
				<Typography sx={{ color: "text.secondary", mb: 1 }}>
					{activity.date}
				</Typography>
				<Typography variant="body2">{activity.description}</Typography>
				<Typography variant="subtitle1">
					{activity.city} / {activity.venue}
				</Typography>
			</CardContent>
			<CardActions
				sx={{ display: "flex", justifyContent: "space-between", pb: 2 }}
			>
				<Chip label={activity.category} variant="outlined" />
				<Box sx={{ display: "flex", justifyContent:"flex-end", gap: 1 }}>
					<Button
						sx={{ background: "red" }}
						onClick={() => handleDeleteActivity(activity.id)}
						size="medium"
						variant="contained"
						disabled={deleteActivity.isPending}
					>
						Delete
					</Button>
					<Button
						onClick={() => selectActivity(activity.id)}
						size="medium"
						variant="contained"
					>
						View
					</Button>
				</Box>
			</CardActions>
		</Card>
	);
}
