import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import 'react-calendar/dist/Calendar.css'
import './app/layout/styles.css'
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import { store, StoreContext } from './app/stores/store'
import { RouterProvider } from 'react-router-dom'
import { router } from './app/router/router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* StoreContext.Provider is a component that we can wrap around our application to provide the store (our MobX stuff) to all of our components */}
    <StoreContext.Provider value={store}> 
      {/* 
      <App /> As we are using React router, we dont have to specify this 
      Instead we are creating a Router Provider component and pass in our route property that we created in router.tsx --> from this file we also have an object that stores our routes centrally
      */}
      <RouterProvider router={router} />
      </StoreContext.Provider>
  </StrictMode>,
)
