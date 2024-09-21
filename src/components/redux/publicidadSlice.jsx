import { createSlice } from "@reduxjs/toolkit";

export const publicidadesSlice = createSlice({
  name: "publicidad",
  initialState: {
    publicidades: null,
  },
  reducers: {
    addPublicidades: (state, action) => {
      state.publicidades = action.payload;
    },
    deletePublicidades: (state, action) => {
      state.publicidades = null;
    },
  },
});

export const { addPublicidades, deletePublicidades } = publicidadesSlice.actions;
export default publicidadesSlice.reducer;
