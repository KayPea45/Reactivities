import { Grid2, Typography } from "@mui/material";
import ProfileHead from "./ProfileHead";
import ProfileContent from "./ProfileContent";
import { useParams } from "react-router";
import { useProfile } from "../../lib/hooks/useProfile";

export default function ProfilePage() {
  // Get the profile id
  const { id } = useParams();
  const {profile, loadingProfile} = useProfile(id);
  
  if (loadingProfile) return <Typography>Loading profile...</Typography>
  
  if (!profile) return <Typography>Profile could not be found</Typography>

  return (
    <Grid2 container >
      <Grid2 size={12}>
         <ProfileHead profile={profile}/>
         <ProfileContent />
      </Grid2>
    </Grid2>
  )
}