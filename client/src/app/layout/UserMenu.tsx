import { Avatar, Box, Divider, ListItemIcon, ListItemText } from '@mui/material';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { useAccount } from '../../lib/hooks/useAccount';
import { Link } from 'react-router';
import { Add, Delete, Logout, Person } from '@mui/icons-material';

// Retrieved from https://mui.com/material-ui/react-menu/#basic-menu
export default function UserMenu() {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const {currentUser, logoutUser, deleteAccount} = useAccount();

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
      color='inherit'
      size='large'
      sx={{fontSize: '1.1rem'}}
      onClick={handleClick}
      >
        <Box display='flex' alignItems='center' gap={2}>
          <Avatar />
          {currentUser?.displayName}
        </Box>
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem component={Link} to='/createActivity' onClick={handleClose}>
          <ListItemIcon>
            <Add />
          </ListItemIcon>
          <ListItemText>Create Activity</ListItemText>
        </MenuItem>
        <MenuItem component={Link} to='/profile' onClick={(handleClose)}>
          <ListItemIcon>
            <Person />
          </ListItemIcon>
          <ListItemText>My Profile</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => {
          deleteAccount.mutate();
          handleClose();
        }}>
          <ListItemIcon sx={{color: 'red'}}>
            <Delete />
          </ListItemIcon>
          <ListItemText sx={{color: 'red'}}>Delete Account</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={() => {
          logoutUser.mutate();
          handleClose();
        }}>
          <ListItemIcon>
            <Logout />
          </ListItemIcon>
          <ListItemText>Logout</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
}