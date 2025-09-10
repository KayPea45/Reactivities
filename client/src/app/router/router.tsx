import { createBrowserRouter, Navigate } from "react-router";
import App from "../layout/App";
import ActivitiesDashboard from "../../features/activities/dashboard/ActivitiesDashboard";
import ActivityForm from "../../features/activities/form/ActivityForm";
import HomePage from "../../features/home/HomePage";
import ActivityDetailPage from "../../features/activities/details/ActivityDetailPage";
import TestErrors from "../../features/errors/TestError";
import NotFound from "../../features/errors/NotFound";
import ServerError from "../../features/errors/ServerError";
import LoginForm from "../../features/account/LoginForm";
import RequireAuth from "./RequireAuth";
import RegisterForm from "../../features/account/RegisterForm";
import ProfilePage from "../../features/profiles/ProfilePage";

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
         // Components that require authentication will be wrapped in the RequireAuth component
         {element: <RequireAuth />, children: [
            {path: 'activities', element: <ActivitiesDashboard />},
            {path: 'activities/:id', element: <ActivityDetailPage />},
            {path: 'createActivity', element: <ActivityForm />},
            // Note on the use of keys - we are using keys to reset the states of the component - https://react.dev/learn/preserving-and-resetting-state#resetting-a-form-with-a-key
            // when we navigate to the same component with different props, the component will not re-render. To force a re-render, we can use the key prop. This will cause the component to unmount and then remount.
            {path: 'manage/:id', element: <ActivityForm key='manage'/>},
            {path: 'profiles/:id', element: <ProfilePage />}
         ]},
         {path:'', element: <HomePage />},
         {path: 'register', element: <RegisterForm />},
         {path: 'login', element: <LoginForm />},
         // For testing errors
         {path: 'errors', element: <TestErrors />},
         {path: 'not-found', element: <NotFound />},
         {path: 'server-error', element: <ServerError />},
         // If navigate to a path that does not exist, redirect to the not-found page
         {path: '*', element: <Navigate replace to='/not-found' />},
      ]
   }
])