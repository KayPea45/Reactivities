import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";

// Our custom hook to fetch the activities
export const useActivities = () => {
	const queryClient = useQueryClient();
	
	// Destructure to retrieve the data from the useQuery hook
	// We can also destructure and retrieve the status of the query, error,
	// useQuery will be used to fetch the data from the API
	const { data: activities, isPending } = useQuery({
		// queryKey is used to identify the query. If the queryKey changes, the query will be re-fetched
		// In this case, the queryKey is the array of activities
		// queryFn is the function that will fetch the data for the query
		/*
      When the component mounts, react-query checks if there is cached data for the queryKey ['activities'].
      If there is cached data and it is still valid, react-query returns the cached data.
      If there is no cached data or the cached data is invalid, react-query calls the queryFn to fetch the data.
      The fetched data is then cached using the queryKey for future use.
       */
		queryKey: ["activities"],
		queryFn: async () => {
			const response = await agent.get<Activity[]>("/activities");
			return response.data;
		},
	});
	
	// useMutation hook will be used to update the activities in the API and the cache
	const updateActivities = useMutation({
		mutationFn: async (activity: Activity) => {
			await agent.put(`/activities`, activity)
		},
		// In the event the mutation was successful, 
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['activities']
			})
		}
	})

	// similar to update but we create a new activity and instead use a post request
	const createActivity = useMutation({
		mutationFn: async (activity: Activity) => {
			await agent.post(`/activities`, activity)
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['activities']
			})
		}
	})

	const deleteActivity = useMutation({
		mutationFn: async (id: string) => {
			await agent.delete(`/activities/${id}`)
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ['activities']
			})
		}
	})
	return { activities, isPending, updateActivities, createActivity, deleteActivity };
};
