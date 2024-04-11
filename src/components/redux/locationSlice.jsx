import { createSlice } from "@reduxjs/toolkit";

export const locationsSlice = createSlice({
  name: "locations",
  initialState: {
    locaciones: null,
  },
  reducers: {
    addLocations: (state, action) => {
      state.locaciones = action.payload;
    },
    deleteLocations: (state, action) => {
      state.locaciones = null;
    },
  },
});

export const { addLocations ,deleteLocations } = locationsSlice.actions;
export default locationsSlice.reducer;