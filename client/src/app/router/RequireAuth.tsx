import { Navigate, Outlet, useLocation } from "react-router";
import { useAccount } from "../../lib/hooks/useAccount";
import { Typography } from "@mui/material";


export default function RequireAuth() {
   const {currentUser, loadingUserInfo} = useAccount();
   const location = useLocation();

   if (loadingUserInfo) return <Typography>Loading...</Typography>

   // After loading, if the user is still not loaded, then user is not authenticated and we redirect to login page
   // and also if they were in a page that needed authentication, we can redirect to the page that the user was trying to access before login
   if (!currentUser) return <Navigate to='/login' state={{from: location}} />

   return (
    <Outlet />
  )
}