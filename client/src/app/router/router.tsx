import { createBrowserRouter, RouteObject } from "react-router-dom";
import App from "../layout/App";
import ActivitiesDashboard from "../../features/activities/dashboard/ActivitiesDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import ActivityDetails from "../../features/activities/details/ActivityDetails";

export const routes: RouteObject[] = [
   {
      // The path will be '/' meaning the root of the application
      // E.g. localhost:3000/, localhost:3000/activities, localhost:3000/createActivity etc.
      // if it matches, then we want to render the App component or the children of the App component
      // The element is the component that we want to render when the path matches
      // Root - Top level route
      path: '/', 
      element: <App />,
      children: [
         // Note on the use of keys - we are using keys to reset the states of the component - https://react.dev/learn/preserving-and-resetting-state#resetting-a-form-with-a-key
         // when we navigate to the same component with different props, the component will not re-render. To force a re-render, we can use the key prop.
         {path: 'activities', element: <ActivitiesDashboard />},
         {path: 'activities/:id', element: <ActivityDetails />},
         {path: 'createActivity', element: <ActivityForm key='create'/>},
         {path: 'manage/:id', element: <ActivityForm key='manage'/>},
      ]
   }
]

export const router = createBrowserRouter(routes);