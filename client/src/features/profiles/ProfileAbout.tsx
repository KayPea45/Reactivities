import { Box, Button, Divider, Typography } from "@mui/material";
import { useParams } from "react-router";
import { useProfile } from "../../lib/hooks/useProfile";
import { useState } from "react";
import EditProfile from "../../app/shared/components/EditProfile";

export default function ProfileAbout() {
	const { id } = useParams();
	const { profile, isCurrentUser, editProfile } = useProfile(id);
	const [editMode, setEditMode] = useState(false);

	const handleProfileUpdate = (profile: Profile) => {
		editProfile.mutate(profile, {
			onSuccess: () => setEditMode(false),
		});
	};

	return (
		<Box>
			<Box display="flex" justifyContent="space-between">
				<Typography variant="h5">About {profile?.displayName}</Typography>
				{isCurrentUser && (
					<Button onClick={() => setEditMode(!editMode)}>
						{editMode ? "Cancel" : "Edit Profile"}
					</Button>
				)}
			</Box>
			<Divider sx={{ my: 2 }} />
			{editMode && profile ? (
				<EditProfile profile={profile} updateProfile={handleProfileUpdate} />
			) : (
				<Box
					sx={{
						overflow: "auto",
						maxHeight: 350,
						scrollbarColor: "#9ca8cfff #d8e5efff",
						scrollbarWidth: "thin",
						scrollBehavior: "smooth",
					}}
				>
					<Typography variant="body1" sx={{ whiteSpace: "pre-wrap" }}>
						{profile?.bio || "No bio added yet"}
					</Typography>
				</Box>
			)}
		</Box>
	);
}
