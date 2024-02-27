//this is our reducer or event handler of state
//we have two action which can make change in store
//first is for theme
//second is for fetching last three search history and save them continuously in local storage with id s -> 0, 1, 2

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  order_items: [],
};
export const torob_Slice = createSlice({
  name: "slice_for_torob",
  initialState,
  reducers: {
    saveOrderItems: (state, action) => {
      console.log("action is");
      console.log(action);
      state.order_items = action.payload;
    },
  },
});

export const { saveOrderItems } = torob_Slice.actions;

export default torob_Slice.reducer;
