/* eslint-disable @typescript-eslint/no-empty-object-type */
import axios, { AxiosResponse } from "axios";
import { Activity } from "../models/activity";

//** Loading delay mockup **//
const sleep = (delay: number) => {
   return new Promise((resolve) => {
      setTimeout(resolve, delay);
   })
}

axios.interceptors.response.use(async response => {
   try {
      await sleep(1000);
      return response;
   } catch (error) {
      console.log(error);
      return await Promise.reject(error);
   }
})
//** End of loading delay **//

// For every request the API makes, uses this URL at the beginning
axios.defaults.baseURL = 'http://localhost:5001/api' // hardcoded for purpose of tutorial

// storing the data we get from the responses from the API requests we make into an variable
// refer a type to our response data as generic type
const responseBody = <T> (response: AxiosResponse<T>) => response.data;

// storing the requests we typically use into an object
const request = {
   // We need to specify generic type for type safety as done in responseBody
   get: <T> (url: string) => axios.get<T>(url).then(responseBody),
   post: <T> (url: string, body: {}) => axios.post<T>(url, body).then(responseBody),
   put: <T> (url: string, body: {}) => axios.put<T>(url, body).then(responseBody),
   del: <T> (url: string) => axios.delete<T>(url).then(responseBody),
}

// continuing on we create an object to store our activities
const Activities = {
   // We need to specify type of Activity for type safety
   // First we need to add generic type to reponseBody above so that we can use it here and that when we call other functions, it knows what specified type to expect
   list: () => request.get<Activity[]>('/activities'), // request from our object above
   details: (id: string) => request.get<Activity>(`/activities/${id}`),

   // specify return type as void as we have no need to return any value
   create: (activity: Activity) => request.post<void>('/activities', activity), 
   update: (activity: Activity) => request.put<void>(`/activities/${activity.id}`, activity),
   delete: (id: string) => request.del<void>(`/activities/${id}`)
}

const agent = {
   Activities
}

export default agent;
