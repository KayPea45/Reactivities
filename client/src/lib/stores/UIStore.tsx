import { makeAutoObservable } from "mobx";

// utlising mobx to create a loading state for the application
export class UIStore {
   isLoading = false;

   constructor() {
      makeAutoObservable(this)
   }

   isBusy() {
      this.isLoading = true
   }

   isIdle() {
      this.isLoading = false
   }
}
