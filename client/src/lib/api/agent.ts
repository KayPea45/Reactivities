import axios from "axios";
import { store } from "../stores/store";
import { toast } from "react-toastify";
import { routes } from "../../app/router/router";

//** Loading delay **//
const sleep = (delay: number) => {
	return new Promise((resolve) => {
		setTimeout(resolve, delay);
	});
};

// withCredentials is used to send cookies with the request
const agent = axios.create({ 
	baseURL: import.meta.env.VITE_API_URL, 
	withCredentials: true 
});

// Do something before a request from the client is actioned by the server
agent.interceptors.request.use((config) => {
	store.uiStore.isBusy();
	return config;
});

// utilise interceptors to do something to the reponse before it gets to the client and also to the request before it gets to the server
// In this case, we target the response and add a delay of 1000ms before it gets to the client to simulate a loading delay
agent.interceptors.response.use(
	// When response is successful, this block of code will run
	async response => {
		await sleep(1000);
		store.uiStore.isIdle();
		return response;
	},
	//else when there is an error
	async error => {
		await sleep(1000);
		store.uiStore.isIdle();
		
		// NOTE: the data object is the whole response object you see in the console
		const {status, data} = error.response

		switch (status) {
			case 400:
				if (data.errors) {
					// represent and format the errors we get
					const modalStateErrors = [];

					// loop over each key in the errors object
					for (const key in data.errors) {
						if (data.errors[key]) {
							modalStateErrors.push(data.errors[key]);
						}
					}
					// flatten the array of arrays into a single array
					throw modalStateErrors.flat();
				} else {
					//else as we are not dealing with data.errors object
					toast.error(data);
				}
				break;
			case 401: 
				toast.error('unauthorised');
				break;
			case 404:
				routes.navigate('/not-found');
				break;
			case 500: 
			   // navigate to the server error page and pass the error data as state
				// the error data can be accessed via destructuring the state in useLocation hook
				routes.navigate('/server-error', {state: {error: data}});
				break;
			default: 
				break;
		}

		// rethrow the error for react query to handle
		return Promise.reject(error);
	}
);
//** End of loading delay **//

// For every request the API makes, uses this URL at the beginning

// storing the data we get from the responses from the API requests we make into an variable
// refer a type to our response data as generic type
// const responseBody = <T> (response: AxiosResponse<T>) => response.data;

// // storing the requests we typically use into an object
// const request = {
//    // We need to specify generic type for type safety as done in responseBody
//    get: <T> (url: string) => axios.get<T>(url).then(responseBody),
//    post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
//    put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
//    del: <T> (url: string) => axios.delete<T>(url).then(responseBody),
// }

// // continuing on we create an object to store our activities
// const Activities = {
//    // We need to specify type of Activity for type safety
//    // First we need to add generic type to reponseBody above so that we can use it here and that when we call other functions, it knows what specified type to expect
//    list: () => request.get<Activity[]>('/activities'), // request from our object above
//    details: (id: string) => request.get<Activity>(`/activities/${id}`),

//    // specify return type as void as we have no need to return any value
//    create: (activity: Activity) => request.post<void>('/activities', activity),
//    update: (activity: Activity) => request.put<void>(`/activities/${activity.id}`, activity),
//    delete: (id: string) => request.del<void>(`/activities/${id}`)
// }

export default agent;
