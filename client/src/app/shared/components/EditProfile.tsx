import { Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import {
	editProfileSchema,
	EditProfileSchema,
} from "../../../lib/schemas/editProfileSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import TextInput from "./TextInput";
import { useEffect } from "react";

type Props = {
	profile: Profile;
	updateProfile: (profile: Profile) => void;
}

export default function EditProfile({profile, updateProfile} : Props) {

	const { reset, handleSubmit, control } = useForm<EditProfileSchema>({
		resolver: zodResolver(editProfileSchema),
		mode: "onTouched",
	});

  useEffect(() => {
	if (profile) {
		reset({
			...profile,
		})
	}
  }, [profile, reset])

  const onSubmit = (data: EditProfileSchema) => {
		// prevent unnecessary api calls if no changes were made
		const newProfile = {...profile, ...data as Profile};
		updateProfile(newProfile);
  }
	return (
		<Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, mt: 3 }}>
			<TextInput label="Display Name" name="displayName" control={control} />
			<TextInput label="Bio" name="bio" control={control} multiline rows={8} />
			<Button type="submit" color="success" sx={{width: "100%"}} variant="contained">Update Profile</Button>
		</Box>
	);
}
