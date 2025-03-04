import { makeAutoObservable, runInAction } from "mobx";
import agent from "../../lib/api/agent";

// import { v4 as uuid } from "uuid"; // To generate unique id for our activities

export default class ActivityStore {
	// Observables - properties that we want to keep track of and update the UI when they change. When we use the observer() function in the component, it will listen to these observables and re-render the component when they change
	// activities: Activity[] = []; array version
	activityRegistry = new Map<string, Activity>(); // Using map that will be more efficient and faster than array
	selectedActivity: Activity | undefined = undefined;
	editMode = false;
	loading = false;
	loadingInitial = false;

	constructor() {
		/* 
      If we want to use the makeObservable function so that we manually set the observables, actions, etc., we can do it like this:
      makeObservable(this, {
         title: observable,
          /// Bind function to the class which allows us to use 'this' in the function which then allows us to access the properties of the class
         setTitle: action.bound,
         /// Or another way is to use arrow functions
         setTitle: action
      })
      */

		/* 
     But we can also use the makeAutoObservable function which    automatically sets the observables, actions, etc.
     It will check the properties of the class and automatically set them as observables
     It will also check the functions of the class and automatically set them as actions and so forth...
     */
		makeAutoObservable(this);
	}

	// Computed function 
	// This will return an array of activities sorted by date in ascending order
	get activitiesByDate() {
		return Array.from(this.activityRegistry.values()).sort((a, b) => 
			Date.parse(a.date) - Date.parse(b.date));
	}

	get groupedActivities() {
		// Returns a key-value pair of activities grouped by date
		return Object.entries(
			// The reduce function will take in parameters activities (the accumulator object which will be an object with keys as dates and values as activities) and activity (the current activity in the iteration)
			// then it will take in a callback function that will return the accumulator object with the date of the activity as the key and the activity as the value
			this.activitiesByDate.reduce((activities, activity) => {
				const date = activity.date; // this string will be the key of our object
				
				// accesses the date property in the activities array and checks if the given date exists/matches in the object. If it does, it will add the activity to the array of activities for that date. If it doesn't, it will create a new array with the activity and assign it to the date key in the object
				activities[date] = activities[date] ? [...activities[date], activity] : [activity];
				return activities; // finally, once we have iterated through all the activities, we return the accumulator object
			}, {} as {[key: string]: Activity[]}) 
			// param to our reduce. Initialise empty object of key-value pairs where the 
			// key (date) is a string and the value is an array of activities.
		)
	}

	loadActivities = async () => {
		this.setLoadingInitial(true);
		try {
			const getActivities = await agent.Activities.list();
			runInAction(() => {
				getActivities.forEach((activity) => {
					this.setActivity(activity);
				});
				// this.activities = getActivities; 
				this.setLoadingInitial(false);
			});
		} catch (error) {
			console.log(error);
			runInAction(() => {
				this.setLoadingInitial(false);
			});
		}
	};
	
	// This is an action that will run when navigating to Activity Details page. 
	// If the activity is already in the registry, it will set the selected activity to that activity. If not, it will fetch the activity from the API and set the selected activity to that activity
	loadActivity = async (id: string) => {
		let activity = this.getActivity(id);
		if (activity) {
			this.selectedActivity = activity;
		} else {	
			// if activity is not in the registry (front-end), fetch it from the API (back-end)
			this.setLoadingInitial(true);
			try {
				activity = await agent.Activities.details(id);
				// The runInAction function is used to ensure that the state is updated and re-rendered in the same action (observer is notified once and renders once)
				runInAction(() => {
					if (activity) {
						this.setActivity(activity);
						this.setLoadingInitial(false);
					}
				});
			} catch (error) {
				console.log(error);
				this.setLoadingInitial(false);
			}
		}
	}

	setActivity = (activity: Activity) => {
		activity.date = activity.date.split("T")[0];
		this.activityRegistry.set(activity.id, activity); // Using map instead of array
		this.selectedActivity = activity;
	}

	private getActivity = (id: string) => {
		return this.activityRegistry.get(id);
	}

	/*
	As we are using routing, we dont need these functions anymore

	selectActivity = (id: string) => {
		// this.selectedActivity = this.activities.find((x) => x.id === id); array version
		this.selectedActivity = this.activityRegistry.get(id);
		this.setEditMode(false);
	};

	cancelSelectedActivity = () => {
		this.selectedActivity = undefined;
		this.setEditMode(false);
	};

	openForm = (id?: string) => {
		if (id) {
			this.selectActivity(id);
		} else {
			this.cancelSelectedActivity();
		}
		this.setEditMode(true);
	};

	closeForm = () => {
		this.selectedActivity = undefined;
		this.setEditMode(false);
	};
	*/

	createActivity = async (activity: Activity) => {
		this.setLoading(true);
		// activity.id = uuid(); called on back-end but we can also generate unique id on front-end as seen in ActivityForm.tsx
		try {
			await agent.Activities.create(activity);
			// We use runInAction from Mobx to ensure that the state is updated and re-rendered in the same action (observer is notified once and renders once)
			runInAction(() => {
				// 1. Add the new activity to the activities array (no need to make a copy of the array as we are adding a new activity)
				// this.activities.push(activity); array version
				this.activityRegistry.set(activity.id, activity);
				// 2. then on front-end, set activity to one newly created user will be able to see the newly created activity on the right side
				this.selectedActivity = activity;
				// 3. Then set edit mode to false so that the form is closed
				this.setEditMode(false);
				this.setLoading(false);
			});
		} catch (error) {
			console.log(error);
			runInAction(() => {
				this.setLoading(false);
			});
		}
	};

	updateActivity = async (activity: Activity) => {
		this.setLoading(true);
		try {
			await agent.Activities.update(activity);
			runInAction(() => {
				// 1. Update the existing activity in the activities array
				// this.activities = [...this.activities.filter((x) => x.id !== activity.id), activity]; array version
				this.activityRegistry.set(activity.id, activity);
				// 2. Set the selected activity to the updated activity
				this.selectedActivity = activity;
				// 3. Set edit mode to false so that the form is closed
				this.setEditMode(false);
				this.setLoading(false);
			});
		} catch (error) {
			console.log(error);
			runInAction(() => {
				this.setLoading(false);
			});
		}
	};

	deleteActivity = async (id: string) => {
		this.setLoading(true);
		try {
			await agent.Activities.delete(id)
			runInAction(() => {
				// this.activities = [...this.activities.filter((x) => x.id !== id)]; array version
				this.activityRegistry.delete(id);
				// if (this.checkIfActivityEditOrView(id)) 
				// 	this.cancelSelectedActivity();
				this.setLoading(false);
			});
		} catch (error) {
			console.log(error);
			runInAction(() => {
				this.setLoading(false);
			});
		}
	};

	setLoadingInitial = (state: boolean) => {
		this.loadingInitial = state;
	};

	setEditMode = (state: boolean) => {
		this.editMode = state;
	};

	setLoading = (state: boolean) => {
		this.loading = state;
	};

	// checkIfActivityEditOrView = (id: string) => {
	// 	return id === this.selectedActivity?.id 
	// };
}
