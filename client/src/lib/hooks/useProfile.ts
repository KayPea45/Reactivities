import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import agent from "../api/agent";
import { useMemo } from "react";

export const useProfile = (id?: string) => {
	const queryClient = useQueryClient();

	const { data: profile, isLoading: loadingProfile } = useQuery<Profile>({
		queryKey: ["profile", id],
		queryFn: async () => {
			const response = await agent.get<Profile>(`/profiles/${id}`);
			return response.data;
		},
		enabled: !!id,
	});

	const { data: photos, isLoading: loadingPhotos } = useQuery<Photo[]>({
		queryKey: ["photos", id],
		queryFn: async () => {
			const response = await agent.get<Photo[]>(`/profiles/${id}/photos`);
			return response.data;
		},
		enabled: !!id,
	});

	const uploadPhoto = useMutation({
		mutationFn: async (file: Blob) => {
			// In order to send a file to the server, we need to use FormData
			const formData = new FormData();
			formData.append("file", file);
			const response = await agent.post("/profiles/add-photo", formData, {
				headers: {
					"Content-Type": "multipart/form-data",
				},
			});
			return response.data;
		},
		onSuccess: async (photo: Photo) => {
			await queryClient.invalidateQueries({
				queryKey: ["photos", id],
			});
         // Update the user and profile data in the cache after a successful upload
         // look at useAccount.ts as we need to update the user imageUrl as well
			queryClient.setQueryData(["user"], (data: User) => {
				if (!data) return data;
				return {
					...data,
					imageUrl: data.imageUrl ?? photo.url, // Update the user imageUrl if it was not set before
				};
			});
         // Update the profile imageUrl if it was not set before
			queryClient.setQueryData(["profile", id], (data: Profile) => {
				if (!data) return data;
				return {
					...data,
					imageUrl: data.imageUrl ?? photo.url, // Update the user imageUrl if it was not set before
				};
			});
		},
	});

	const setMainPhoto = useMutation({
		mutationFn: async (photo: Photo) => {
			// Avoid unnecessary request if the photo is already the main photo
			if (photo.url === profile?.imageUrl) return;
			await agent.put(`/profiles/${photo.id}/setMainPhoto`);
		},
		onSuccess: (_, photo) => {
			queryClient.setQueryData(['user'], (userData: User) => {
				if (!userData) return userData;
				return {
					...userData,
					imageUrl: photo.url // Update the user imageUrl to the new main photo url
				}
			});
			queryClient.setQueryData(['profile', id], (profile: Profile) => {
				if (!profile) return profile;
				return {
					...profile,
					imageUrl: photo.url // Update the user imageUrl to the new main photo url
				}
			})
		}
	});

	// Special Case: User can unset main photo and revert back to default avatar
	const unsetMainPhoto = useMutation({
		mutationFn: async (photoId: string) => {
			await agent.put(`/profiles/${photoId}/unSetMainPhoto`);
		},
		onSuccess: () => {
			queryClient.setQueryData(['user'], (user: User) => {
				if (!user) return user
				return {
					...user,
					imageUrl: null // Set the user imageUrl to null
				}
			});
			queryClient.setQueryData(['profile', id], (profile: Profile) => {
				if (!profile) return profile
				return {
					...profile,
					imageUrl: null // Set the profile imageUrl to null
				}
			})
		}
	})
	
	const deletePhoto = useMutation({
		mutationFn: async (photoId: string) => {
			await agent.delete(`/profiles/${photoId}/photos`)
		},
		// after successfully deleting a photo, we need to know which photo to remove from our state 
		// this is done when we filter out the deleted photo from our photos array in the cache
		// NOTE: the photoId is retrieved from the mutation function parameter
		onSuccess: (_, photoId) => {
			queryClient.setQueryData(['photos', id], (photos: Photo[]) => {
				return photos?.filter(x => x.id !== photoId)
			})
		}
	});

	const editProfile = useMutation({
		mutationFn: async (editProfile: Profile) => {
			// check if the displayName or bio has changed, if not, return
			if (editProfile.displayName === profile?.displayName && editProfile.bio === profile?.bio) return;
			await agent.put(`/profiles/editProfile`, editProfile);
		},
		onSuccess: (_, editProfile) => {
			queryClient.setQueryData(['user'], (userData: User) => {
				if (!userData) return userData;
				return {
					...userData,
					displayName: editProfile.displayName, 
					bio: editProfile.bio // Update the user displayName and bio in our state to the new displayName and bio
				}
			});
			queryClient.setQueryData(['profile', id], (profile: Profile) => {
				if (!profile) return profile;
				return {
					...profile,
					displayName: editProfile.displayName,
					bio: editProfile.bio  // Update the profile displayName and bio in our state to the new displayName and bio
				}
			})
		}
	})


	// memoize so that we dont recreate this each time our component re-renders unless dependency change in our useMemo
	const isCurrentUser = useMemo(() => {
		// Access our cache of data in our react query, here we are getting the user info and checking if there is a change to user
		return id === queryClient.getQueryData<User>(["user"])?.id;
	}, [id, queryClient]);

	return {
		profile,
		loadingProfile,
		photos,
		loadingPhotos,
		isCurrentUser,
		uploadPhoto,
		setMainPhoto,
		deletePhoto,
		editProfile,
		unsetMainPhoto
	};
};
