import { AccessTime, Place } from "@mui/icons-material";
import {
	Avatar,
	Box,
	Button,
	Card,
	CardContent,
	CardHeader,
	Chip,
	Divider,
	Typography,
} from "@mui/material";
import { Link } from "react-router";
import { formatDateTime } from "../../../lib/util/util";
import AvatarPopup from "../../../app/shared/components/AvatarPopup";

type Props = {
	activity: Activity;
};

export default function ActivityCard({ activity }: Props) {
	const label = activity.isHost ? "You are hosting" : "You are going";
	const colour = activity.isHost ? "secondary" : activity.isGoing ? "warning" : "default";

	return (
		<Card elevation={3} sx={{ borderRadius: 3 }}>
			<Box display="flex" alignItems="center" justifyContent="space-between">
				<CardHeader
					avatar={<Avatar src={activity.hostImageUrl} sx={{ height: 80, width: 80 }} alt="image of the host"/>}
					title={activity.title}
					slotProps={{ title: { fontWeight: "bold", fontSize: 20 } }}
					subheader={
						<>
							Hosted by{" "}
							<Link to={`/profiles/${activity.hostId}`}>
								{activity.hostDisplayName}
							</Link>
						</>
					}
				/>
				<Box display="flex" flexDirection="column" gap={2} mr={2}>
					{(activity.isHost || activity.isGoing) && (
						<Chip variant="outlined" label={label} color={colour} sx={{ borderRadius: 2 }} />
					)}
					{activity.isCancelled && (
						<Chip label="Cancelled" color="error" sx={{ borderRadius: 2 }} />
					)}
				</Box>
			</Box>

			<Divider sx={{ mb: 3 }} />

			<CardContent sx={{ p: 0 }}>
				<Box display="flex" alignItems="center" mb={2} px={2}>
					<Box display="flex" flexGrow={0} alignItems="center">
						{/* AccessTime and Place is from Material UI icon */}
						<AccessTime sx={{ mr: 1 }} />
						<Typography variant="body2" noWrap>
							{formatDateTime(activity.date)}
						</Typography>
					</Box>
					<Place sx={{ ml: 3, mr: 1 }} />
					<Typography variant="body2">{activity.venue}</Typography>
				</Box>
				<Divider />
				<Box
					display="flex"
					gap={2}
					sx={{ backgroundColor: "grey.200", py: 3, pl: 3 }}
				>
					{activity.attendees.map((attendee) => (
						<AvatarPopup key={attendee.id} profile={attendee} />
					))}
				</Box>
			</CardContent>
			<CardContent sx={{ pb: 2 }}>
				<Typography variant="body2">{activity.description}</Typography>
				<Box display="flex" justifyContent="flex-end">
					<Button
						component={Link}
						to={`/activities/${activity.id}`}
						size="medium"
						variant="contained"
						sx={{ borderRadius: 3 }}
					>
						View
					</Button>
				</Box>
			</CardContent>
		</Card>
	);
}
