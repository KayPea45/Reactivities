import NavBar from "./NavBar";
import { observer } from "mobx-react-lite";
// import { Outlet, useLocation } from "react-router-dom";
// import HomePage from "../../features/home/HomePage";
import { useEffect, useState } from "react";
import { Activity } from "../models/activity";
// import agent from "../api/agent";
import { Box, Container, CssBaseline } from "@mui/material";
import axios from "axios";
import ActivitiesDashboard from "../../features/activities/dashboard/ActivitiesDashboard";

function App() {
	// This is the main component that wraps our application
	// On the Outlet component, it acts as a placeholder for the child routes to be rendered which we have defined in our router.tsx

	// the useLocation hook is used to get the current location. This will be used to make sure its not on our navigation. Basically, we dont want our navbar to show on the home page
	// const location = useLocation();

	const [activities, setActivities] = useState<Activity[]>([]);
	const [activity, setSelectedActivity] = useState<Activity | undefined>(
		undefined
	);
	const [editMode, setEditMode] = useState(false);

	useEffect(() => {
		axios
			.get<Activity[]>("https://localhost:5001/api/activities")
			.then((response) => setActivities(response.data));
		return () => {};
	}, []);

	const handleSelectedActivity = (id: string) => {
		setSelectedActivity(activities.find((x) => x.id === id));
	};

	const handleCancelSelectedActivity = () => {
		setSelectedActivity(undefined);
	};

	const handleEditMode =(editMode: boolean) => {
		setEditMode(editMode);
	}

	const handleSubmitForm = (activity: Activity) => {
		if (activity.id) {
			setActivities(activities.map((x) => (x.id === activity.id ? activity : x)));
			setSelectedActivity(activity);
		} else {
			const newActivity = {...activity,  id: activities.length.toString()}
			setActivities([...activities, newActivity]);
			setSelectedActivity(activity);
		}
		handleEditMode(false);
	}

	const handleDeleteActivity = (id: string) => {
		setActivities(activities.filter((x) => x.id !== id))
		handleEditMode(false);
		setSelectedActivity(undefined);
	}

	return (
		<>
			{/* {location.pathname === "/" ? (
				<HomePage />
			) : ( */}
			<Box sx={{ bgcolor: "#eeeeee" }}>
				<CssBaseline />
				<NavBar setEditMode={handleEditMode}/>
				<Container /*className="main-list"*/ maxWidth="xl" sx={{ mt: 3 }}>
					{/* <Outlet /> */}
					<ActivitiesDashboard
						activities={activities}
						selectActivity={handleSelectedActivity}
						cancelSelectActivity={handleCancelSelectedActivity}
						selectedActivity={activity}
						editMode={editMode}
						handleEditMode={handleEditMode}
						submitForm={handleSubmitForm}
						deleteActivity={handleDeleteActivity}
					/>
				</Container>
			</Box>
			{/* )} */}
		</>
	);
}

// export default App;

// This is a higher order component that wraps our App component. This is done to make our App component reactive and re-render when the observable state changes
export default observer(App);
