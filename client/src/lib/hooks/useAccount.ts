import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { LoginSchema } from "../schemas/loginSchema";
import agent from "../api/agent";
import { useNavigate } from "react-router";
import { RegisterSchema } from "../schemas/registerSchema";
import { toast } from "react-toastify";

// This hook is used to handle the login functionality of the application
// It uses the useMutation hook from react-query to handle the login request  
// The useMutation hook is used to perform a mutation (in this case, a POST request) and handle the response
export const useAccount = () => {

   // useQueryClient is used to access the query client instance
   // The query client is used to manage the cache and perform queries and mutations
   const queryClient = useQueryClient();

   const navigate = useNavigate();

   const loginUser = useMutation({
      mutationFn: async (creds: LoginSchema) => {
         // NOTE: /login endpoint is from Identity api endpoint
         await agent.post('/login?useCookies=true', creds);
      },
      // In the event the mutation was successful, we invalidate the user query to refetch the user data.
      // queryKey is used to identify the query that we want to invalidate
      // In this case, the queryKey is ['user'] which is the same as the queryKey used in the useQuery hook below to fetch the user data
      onSuccess: async () => {
         await queryClient.invalidateQueries({
            queryKey: ['user']
         })
      }
   });

   const registerUser = useMutation({
      mutationFn: async (creds: RegisterSchema) => {
         await agent.post('/account/register', creds);
      },
      onSuccess: () => {
         toast.success('Register was successful! Please login to continue to Reactivities!')
         navigate('/login'); // redirect to the login page after successful registration
      }
   })

   const logoutUser = useMutation({
      mutationFn: async () => {
         await agent.post('/account/logout');
      },
      onSuccess: async () => {
         queryClient.removeQueries({
            queryKey: ['user']
         });
         queryClient.removeQueries({
            queryKey: ['activities']
         });
         toast.done('Account was deleted');
         navigate('/login'); // redirect to the home page after logout
      }
   })

   const deleteAccount = useMutation({
      mutationFn: async () => {
         await agent.delete('/account/delete')
      },
      onSuccess: async () => {
         queryClient.removeQueries({
            queryKey: ['user']
         });
         queryClient.removeQueries({
            queryKey: ['activities']
         });
         await navigate('/'); // redirect to the home page after logout
      }
   })

   // Fetch the current loggedin user from server and store it in the cache
   // also need to check if were loading before verifying for current user
   // NOTE: remember that query is loaded everytime we call the hook
   // So when we call useAccount hook in RegisterForm with destructuring the registerUser function, it will call the useQuery hook again and fetch the user data again
   // But we wanna avoid this so extra configuration done on enabled property.
   const {data: currentUser, isLoading: loadingUserInfo} = useQuery({
      queryKey: ['user'],
      queryFn: async () => {
         const response = await agent.get<User>('/account/user-info');
         return response.data;
      },
      // only run this query if the user query is not already in the cache and the pathname is not /register and the pathname is /login
      enabled: !queryClient.getQueryData(['user'])
   })

   return { loginUser, currentUser, logoutUser, loadingUserInfo, registerUser, deleteAccount };
}