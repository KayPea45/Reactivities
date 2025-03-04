import { Group } from "@mui/icons-material";
import {
	AppBar,
	Box,
	Button,
	Container,
	CssBaseline,
	MenuItem,
	Toolbar,
	Typography,
} from "@mui/material";

type Props = {
	setEditMode: (editMode: boolean, isNew: boolean) => void;
}

export default function NavBar({setEditMode}: Props) {
	return (
		<>
			<CssBaseline />
			<Box sx={{ flexGrow: 1 }}>
				<AppBar
					position="static"
					sx={{
						backgroundImage:
							"linear-gradient(135deg, #182a73 0%, #218aae 69%, #20a7ac 89%)",
					}}
				>
					<Container maxWidth="xl">
						<Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
							<Box>
								<MenuItem sx={{ display: "flex", gap: 2 }}>
									<Group fontSize="large" />
									<Typography variant="h4" fontWeight="bold">
										Reactivities
									</Typography>
								</MenuItem>
							</Box>
							<Box sx={{display: 'flex', justifyContent: 'flex-start'}}>
								<MenuItem
									sx={{
										fontSize: "1.2rem",
										textTransform: "uppercase",
										fontWeight: "bold",
									}}
								>
                  Activities
								</MenuItem>
                <MenuItem
									sx={{
										fontSize: "1.2rem",
										textTransform: "uppercase",
										fontWeight: "bold",
									}}
								>
                  About
								</MenuItem>
                <MenuItem
									sx={{
										fontSize: "1.2rem",
										textTransform: "uppercase",
										fontWeight: "bold",
									}}
								>
                  Contact
								</MenuItem>
							</Box>
              <Button onClick={() => setEditMode(true, true)} size="large" variant="contained" color="warning">
                  Create activity
              </Button>
						</Toolbar>
					</Container>
				</AppBar>
			</Box>
		</>
	);
}
