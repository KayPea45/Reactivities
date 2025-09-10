import {
	Avatar,
	Box,
	Dialog,
	DialogActions,
	DialogContent,
	DialogContentText,
	DialogTitle,
	Divider,
	ListItemIcon,
	ListItemText,
} from "@mui/material";
import Button from "@mui/material/Button";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { useState } from "react";
import { useAccount } from "../../lib/hooks/useAccount";
import { Link } from "react-router";
import { Add, Delete, Logout, Person } from "@mui/icons-material";

// Retrieved from https://mui.com/material-ui/react-menu/#basic-menu
export default function UserMenu() {
	const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
	const { currentUser, logoutUser, deleteAccount } = useAccount();
	const [openDialog, setOpenDialog] = useState(false);

	const handleClickOpen = () => {
		setOpenDialog(true);
	};

	const handleCloseDialog = (toBeDeleted : boolean) => {
    if (toBeDeleted) {
      	deleteAccount.mutate();
        handleClose();
    }
		setOpenDialog(false);
	};

	const open = Boolean(anchorEl);
	const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
		setAnchorEl(event.currentTarget);
	};
	const handleClose = () => {
		setAnchorEl(null);
	};

	return (
		<>
			<Button
				color="inherit"
				size="large"
				sx={{ fontSize: "1.1rem" }}
				onClick={handleClick}
			>
				<Box display="flex" alignItems="center" gap={2}>
					<Avatar
						src={currentUser?.imageUrl}
						alt="main image of logged-in user"
					/>
					{currentUser?.displayName}
				</Box>
			</Button>
			<Menu
				id="basic-menu"
				anchorEl={anchorEl}
				open={open}
				onClose={handleClose}
				MenuListProps={{
					"aria-labelledby": "basic-button",
				}}
			>
				<MenuItem component={Link} to="/createActivity" onClick={handleClose}>
					<ListItemIcon>
						<Add />
					</ListItemIcon>
					<ListItemText>Create Activity</ListItemText>
				</MenuItem>
				<MenuItem
					component={Link}
					to={`/profiles/${currentUser?.id}`}
					onClick={handleClose}
				>
					<ListItemIcon>
						<Person />
					</ListItemIcon>
					<ListItemText>My Profile</ListItemText>
				</MenuItem>
				<MenuItem
					onClick={handleClickOpen}
				>
					<ListItemIcon sx={{ color: "red" }}>
						<Delete />
					</ListItemIcon>
					<ListItemText sx={{ color: "red" }}>Delete Account</ListItemText>
				</MenuItem>
				<Divider />
				<MenuItem
					onClick={() => {
						logoutUser.mutate();
						handleClose();
					}}
				>
					<ListItemIcon>
						<Logout />
					</ListItemIcon>
					<ListItemText>Logout</ListItemText>
				</MenuItem>
			</Menu>
      <Dialog
							open={openDialog}
							onClose={handleCloseDialog}
							aria-labelledby="alert-dialog-title"
							aria-describedby="alert-dialog-description"
						>
							<DialogTitle id="alert-dialog-title">
								{"Delete account confirmation"}
							</DialogTitle>
							<DialogContent>
								<DialogContentText id="alert-dialog-description">
									Are you sure you want to delete your acccount?
								</DialogContentText>
							</DialogContent>
							<DialogActions>
								<Button onClick={() => handleCloseDialog(false)}>Cancel</Button>
								<Button sx={{color: 'red'}} onClick={() => handleCloseDialog(true)} autoFocus>
									Yes
								</Button>
							</DialogActions>
						</Dialog>
		</>
	);
}
