import NavBar from "./NavBar";
import { observer } from "mobx-react-lite";
// import { Outlet, useLocation } from "react-router-dom";
// import HomePage from "../../features/home/HomePage";
import { useState } from "react";
// import agent from "../api/agent";
import { Box, Container, CssBaseline, Typography } from "@mui/material";
import ActivitiesDashboard from "../../features/activities/dashboard/ActivitiesDashboard";
import { useActivities } from "../../lib/hooks/useActivities";

// NOTE: React query handles state management on the server side. Mobx handles state management on the client side. 
function App() {
	const [activity, setSelectedActivity] = useState<Activity | undefined>(
		undefined
	);
	const [editMode, setEditMode] = useState(false);

	// Retrieve activities from our custom Hook
	const {activities, isPending} = useActivities();

	const handleSelectedActivity = (id: string) => {
		if (id) {
			setSelectedActivity(activities!.find((x) => x.id === id));
		}
	};

	const handleCancelSelectedActivity = () => {
		setSelectedActivity(undefined);
	};

	const handleEditMode = (editMode: boolean, isNew?: boolean) => {
		setEditMode(editMode);
		if (isNew) {
			setSelectedActivity(undefined);
		}
	};

	return (
		<>
			{/* {location.pathname === "/" ? (
				<HomePage />
			) : ( */}
			<Box sx={{ bgcolor: "#eeeeee", minHeight: "100vh" }}>
				<CssBaseline />
				<NavBar setEditMode={handleEditMode} />
				<Container /*className="main-list"*/ maxWidth="xl" sx={{ mt: 3 }}>
					{!activities || isPending ? (
						<Typography>Loading...</Typography>
					) : (
						<ActivitiesDashboard
							activities={activities}
							selectActivity={handleSelectedActivity}
							cancelSelectActivity={handleCancelSelectedActivity}
							selectedActivity={activity}
							editMode={editMode}
							handleEditMode={handleEditMode}
						/>
					)}
				</Container>
			</Box>
			{/* )} */}
		</>
	);
}

// export default App;

// This is a higher order component that wraps our App component. This is done to make our App component reactive and re-render when the observable state changes
export default observer(App);
