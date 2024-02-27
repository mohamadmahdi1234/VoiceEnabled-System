//here is our store
import { configureStore } from "@reduxjs/toolkit";
import torob_Reducer from "./reducer";
const store = configureStore({
  reducer: {
    slice_for_torob: torob_Reducer,
  },
});
export default store;
