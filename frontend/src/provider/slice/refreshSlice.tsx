import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  key: 0, // Initial value for the refresh key
};

export const refreshSlice = createSlice({
  name: "refresh",
  initialState,
  reducers: {
    triggerRefresh: (state) => {
      state.key += 1; // Increment key to trigger refresh
    },
  },
});

// Export the action
export const { triggerRefresh } = refreshSlice.actions;

// Selector to access the key
export const selectRefreshKey = (state: any) => state.refresh.key;

// Export the reducer to add to the store
export default refreshSlice.reducer;
