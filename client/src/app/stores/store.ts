// Using this to store all the stores in one place

import { createContext, useContext } from "react";
import ActivityStore from "./activityStore";

interface Store {
   activityStore: ActivityStore
}

export const store: Store = {
   activityStore: new ActivityStore()
}

export const StoreContext = createContext(store);

// React hook to let us use the store in our components
export function useStore() {
   return useContext(StoreContext);
}