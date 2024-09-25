import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./userSlice";
import totemReducer from "./totemSlice";
import locationReducer from "./locationSlice";
import publicidadesReducer from "./publicidadSlice";

export const store = configureStore({
  reducer: {
    user: userReducer,
    totem: totemReducer,
    locations: locationReducer,
    publicidad: publicidadesReducer
  },
});