import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import { useLocation } from "react-router";
import { FieldValues } from "react-hook-form";
import { useAccount } from "./useAccount";

// Our custom hook to fetch the activities
export const useActivities = (id?: string) => {
	const queryClient = useQueryClient();
	const { currentUser } = useAccount();
	const location = useLocation();

	// Destructure to retrieve the data from the useQuery hook
	// We can also destructure and retrieve the status of the query, error,
	// useQuery will be used to fetch the data from the API
	const { data: activities, isLoading } = useQuery({
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
		// Only enabled when the user is logged in and the pathname is '/activities'
		enabled: !id && location.pathname === "/activities" && !!currentUser,
		// We can use select to transform the data before it is returned
		// Here we will show to current user if they are the host of the activity or if they are going to the activity
		select: (data) => {
			return data.map((activity) => {
				return {
					...activity,
					isHost: activity.hostId === currentUser?.id,
					isGoing: activity.attendees.some(
						(attendee) => attendee.id === currentUser?.id
					),
				};
			});
		},
	});

	// Retrieve an activity record by id
	// NOTE: need to pass in the id as a parameter to the useQuery hook
	const { data: activity, isLoading: isLoadingActivity } = useQuery({
		queryKey: ["activities", id],
		queryFn: async () => {
			const response = await agent.get<Activity>(`/activities/${id}`);
			return response.data;
		},
		enabled: !!id && !!currentUser, // the !! operator is used to convert the id to a boolean value
		// We enable the query only if the id is present else if we dont have this, this query will still run and it will return an error
		// Same as above query, we can use select to transform the data before it is returned for individual activity
		select: (data) => {
			return (data = {
				...data,
				isHost: data.hostId === currentUser?.id,
				isGoing: data.attendees.some(
					(attendee) => attendee.id === currentUser?.id
				),
			});
		},
	});

	// useMutation hook will be used to update the activities in the API and the cache
	const updateActivities = useMutation({
		mutationFn: async (activity: Activity) => {
			await agent.put(`/activities`, activity);
		},
		// In the event the mutation was successful,
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["activities"],
			});
		},
	});

	// similar to update but we create a new activity and instead use a post request
	const createActivity = useMutation({
		mutationFn: async (activity: FieldValues) => {
			const response = await agent.post(`/activities`, activity); // should return the id of the new activity, check CreateActivity in Application folder within Command
			return response.data;
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["activities"],
			});
		},
	});

	const deleteActivity = useMutation({
		mutationFn: async (id: string) => {
			await agent.delete(`/activities/${id}`);
		},
		onSuccess: async () => {
			await queryClient.invalidateQueries({
				queryKey: ["activities"],
			});
		},
	});

	const updateAttendance = useMutation({
		mutationFn: async (id: string) => {
			// console.log("mutation fn id: ", id)
			await agent.post(`/activities/${id}/attend`);
		},
		// Optimistic update to the cache
		onMutate: async (activityId: string) => {
			// cancel any outgoing refetches (so they don't overwrite our optimistic update)
			await queryClient.cancelQueries({ queryKey: ["activities", activityId] });

			// a copy of the current state of our query (copy of individual activity in query) that we get from the cache
			const prevActivity = queryClient.getQueryData<Activity>([
				"activities",
				activityId,
			]);

			// then do optimistic update to the cache
			queryClient.setQueryData<Activity>(
				["activities", activityId],
				(oldActivity) => {
					// We can rollback the state if oldActivity and currentUser are not present
					if (!oldActivity || !currentUser) {
						return oldActivity;
					}

					// check if user is host or if they are attending the activity
					const isHost = oldActivity.hostId === currentUser.id;
					const isAttending = oldActivity.attendees.some(
						(x) => x.id === currentUser.id
					);

					// We return the old activity with the updated values
					return {
						...oldActivity,
						// assign isCancelled based on whether the current user is host and old activity is not cancelled or cancelled. we set the opposite of the old query
						isCancelled: isHost
							? !oldActivity.isCancelled
							: oldActivity.isCancelled,
						// assign attendees, if user is host then we assign the old activity attendees (do nothing), else if the user was attending the activity, we remove them from the attendees array
						// else we add them to the attendees array
						attendees: isAttending
							? isHost
								? oldActivity.attendees
								: oldActivity.attendees.filter((x) => x.id !== currentUser.id)
							: [
									...oldActivity.attendees,
									{
										id: currentUser.id,
										displayName: currentUser.displayName,
										imageUrl: currentUser.imageUrl,
									},
							  ],
					};
				}
			);

			// return a context object that contains the previous activity
			// which will be used in the onError function to rollback the state
			// NOTE: we set our query data to the old activity as defined above
			// if error, then the prevActivity will be used to rollback the state
			return { prevActivity };
		},
		// NOTE: context is the object that we returned from the onMutate function
		onError: (error, activityId, context) => {
			console.log("error: ", error);
			// if there is an error, we can rollback the state
			// we can use the context that we passed in the onMutate function to rollback the state
			if (context?.prevActivity) {
				queryClient.setQueryData(
					["activities", activityId],
					context.prevActivity
				);
			}
		},
		// onSuccess: async () => {
		// 	// console.log("on Success id: ", id)
		// 	await queryClient.invalidateQueries({
		// 		queryKey: ["activities", id],
		// 	});
		// },
	});
	return {
		activities,
		isLoading,
		updateActivities,
		createActivity,
		deleteActivity,
		activity,
		isLoadingActivity,
		updateAttendance,
	};
};
