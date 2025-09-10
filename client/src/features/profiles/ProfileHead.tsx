import {
	Avatar,
	Box,
	Button,
	Chip,
	Divider,
	Grid2,
	Paper,
	Stack,
	Typography,
} from "@mui/material";

type Props = {
	profile: Profile
}

export default function ProfileHead({ profile }: Props) {
	const isFollowing = true;
	return (
		<Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
			<Grid2 container spacing={2}>
				<Grid2 size={8}>
					{/* Another container that allows items inside the stack to be aligned in a row or column */}
					<Stack direction="row" spacing={2} alignItems="center">
						<Avatar src={profile.imageUrl} sx={{ width: 150, height: 150 }} alt={'image of ' + profile.displayName}/>
						<Box sx={{ marginLeft: '42px !important' }} display="flex" flexDirection="column" gap={2}>
							<Typography variant="h4">{profile.displayName}</Typography>
								{isFollowing && (
									<Chip
										
										variant="outlined"
										color="secondary"
										label="Following"
                              sx={{ borderRadius: 1}}
									/>
								)}
						</Box>
					</Stack>
				</Grid2>
				<Grid2 size={4}>
					<Stack spacing={2} alignItems="center">
						<Box display="flex" justifyContent="space-around" width="100%">
							<Box textAlign="center">
								<Typography variant="h6">Followers</Typography>
								<Typography variant="h3">34</Typography>
							</Box>
							<Box textAlign="center">
								<Typography variant="h6">Following</Typography>
								<Typography variant="h3">3</Typography>
							</Box>
						</Box>
                  <Divider sx={{width: "100%"}} />
                  <Button fullWidth variant="outlined" color={isFollowing ? 'error' : 'success'} > {isFollowing ? 'Unfollow': 'follow'}</Button>
					</Stack>
				</Grid2>
			</Grid2>
		</Paper>
	);
}
