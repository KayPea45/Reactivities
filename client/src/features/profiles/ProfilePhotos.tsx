import { useParams } from "react-router";
import { useProfile } from "../../lib/hooks/useProfile";
import {
	Box,
	Button,
	Divider,
	ImageList,
	ImageListItem,
	Typography,
} from "@mui/material";
import { useState } from "react";
import PhotoUpload from "../../app/shared/components/PhotoUpload";
import StarButton from "../../app/shared/components/StarButton";
import DeleteButton from "../../app/shared/components/DeleteButton";

export default function ProfilePhotos() {
	const { id } = useParams();
	const {
		photos,
		loadingPhotos,
		isCurrentUser,
		uploadPhoto,
		profile,
		setMainPhoto,
		deletePhoto,
		unsetMainPhoto,
	} = useProfile(id);

	const [editMode, setEditMode] = useState(false);

	if (loadingPhotos) return <Typography>Loading photos...</Typography>;

	const handlePhotoUpload = (file: Blob) => {
		uploadPhoto.mutate(file, {
			onSuccess: () => {
				setEditMode(false);
			},
		});
	};

	const unSetMainPhoto = () => {
		const photo = photos?.find((photo) => photo.url === profile?.imageUrl);
		if (!photo) return;
		unsetMainPhoto.mutate(photo?.id);
	};

	return (
		<Box>
			<Box display="flex" justifyContent="space-between">
				<Typography variant="h5">Photos</Typography>
				{isCurrentUser && (
					<Box gap={1} display="flex">
						{!editMode && profile?.imageUrl !== null && (
							<Button variant="contained" onClick={() => unSetMainPhoto()}>
								Clear profile photo
							</Button>
						)}
						<Button variant="contained" onClick={() => setEditMode(!editMode)}>
							{editMode ? "Cancel" : "Add photo"}
						</Button>
					</Box>
				)}
			</Box>
			<Divider sx={{ my: 2 }} />
			{editMode ? (
				<PhotoUpload
					uploadPhoto={handlePhotoUpload}
					loading={uploadPhoto.isPending}
				/>
			) : (
				<>
					{photos?.length === 0 ? (
						<Typography>No photos...</Typography>
					) : (
						<ImageList sx={{ height: 450 }} cols={4} rowHeight={164}>
							{(photos ?? []).map((photo) => (
								<ImageListItem key={photo.id}>
									<img
										srcSet={`${photo.url.replace(
											"/upload/",
											// How we specify the custom sizing etc. in cloudinary
											"/upload/w_164,h_164,c_fill,f_auto,dpr_2,g_face/"
										)}`}
										src={`${photo.url.replace(
											"/upload/",
											"/upload/w_164,h_164,c_fill,f_auto,g_face/"
										)}`}
										alt={"Photo from " + profile?.displayName}
										loading="lazy"
									/>
									{isCurrentUser && (
										// Using div here because we get error if we use Fragment in the ImageListItem component
										<div>
											<Box
												sx={{ position: "absolute", top: 0, left: 0 }}
												onClick={() => {
													setMainPhoto.mutate(photo);
												}}
											>
												<StarButton
													selected={photo.url === profile?.imageUrl}
												/>
											</Box>
											{profile?.imageUrl !== photo.url && (
												<Box
													sx={{ position: "absolute", top: 0, right: 0 }}
													onClick={() => {
														deletePhoto.mutate(photo.id);
													}}
												>
													<DeleteButton />
												</Box>
											)}
										</div>
									)}
								</ImageListItem>
							))}
						</ImageList>
					)}
				</>
			)}
		</Box>
	);
}
