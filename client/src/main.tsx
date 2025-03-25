import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "react-calendar/dist/Calendar.css";
import "./app/layout/styles.css";
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import 'react-toastify/dist/ReactToastify.css';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { RouterProvider } from "react-router";
import { routes } from "./app/router/router";
import { store, StoreContext } from "./lib/stores/store";
import { ToastContainer } from "react-toastify";

// Will act as a global state on the server side or our asynchronus state that will help us manage and keep the data across client and server in sync.
// It manages the cache and the state of the data that we are fetching from the server.
const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
	<StrictMode>
		<StoreContext.Provider value={store}>
			{/* Provide client to  */}
			<QueryClientProvider client={queryClient}>
				<ReactQueryDevtools initialIsOpen={false} />
				<ToastContainer position="bottom-right" hideProgressBar theme='colored'/>
				<RouterProvider router={routes} />
			</QueryClientProvider>
		</StoreContext.Provider>
	</StrictMode>
);
