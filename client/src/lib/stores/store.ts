// Using this to store all the stores in one place

import { createContext, useContext } from "react";
import { UIStore } from "./uiStore";

interface Store {
   uiStore: UIStore
}

export const store: Store = {
   uiStore: new UIStore()
}

// React context
export const StoreContext = createContext(store);

// React hook to let us use the store in our components
export function useStore() {
   return useContext(StoreContext);
}