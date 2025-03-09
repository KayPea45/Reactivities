import NavBar from "./NavBar";
// import { Outlet, useLocation } from "react-router-dom";
// import HomePage from "../../features/home/HomePage";
// import agent from "../api/agent";
import { Box, Container, CssBaseline } from "@mui/material";
import { Outlet } from "react-router";

// NOTE: React query handles state management on the server side. Mobx handles state management on the client side.
function App() {
	return (
		<>
			{/* {location.pathname === "/" ? (
				<HomePage />
			) : ( */}
			<Box sx={{ bgcolor: "#eeeeee", minHeight: "100vh" }}>
				<CssBaseline />
				<NavBar />
				<Container /*className="main-list"*/ maxWidth="xl" sx={{ mt: 3 }}>
					{/* 
					The parent route defines a layout or structure that will be shared by all its child routes.
						 The Outlet component is placed in the parent component where the child components should be rendered.  */
					}
					<Outlet />
				</Container>
			</Box>
			{/* )} */}
		</>
	);
}

// export default App;

// This is a higher order component that wraps our App component. This is done to make our App component reactive and re-render when the observable state changes
export default App;
