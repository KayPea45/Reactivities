import { createBrowserRouter } from "react-router";
import App from "../layout/App";
import ActivitiesDashboard from "../../features/activities/dashboard/ActivitiesDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import HomePage from "../../features/home/HomePage";
import ActivityDetailPage from "../../features/activities/details/ActivityDetailPage";

export const routes = createBrowserRouter([
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
         // when we navigate to the same component with different props, the component will not re-render. To force a re-render, we can use the key prop. This will cause the component to unmount and then remount.
         {path:'', element: <HomePage />},
         {path: 'activities', element: <ActivitiesDashboard />},
         {path: 'activities/:id', element: <ActivityDetailPage />},
         {path: 'createActivity', element: <ActivityForm />},
         {path: 'manage/:id', element: <ActivityForm key='manage'/>},
      ]
   }
])