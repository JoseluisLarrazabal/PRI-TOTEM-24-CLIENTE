import { createSlice } from "@reduxjs/toolkit";

const US = {
  idUsuario: null,
  institucion: null,
  rol: null,
  token: null,
  nombre: null,
  apellido: null,
  email: null,
  loginMode: null,
};

export const userSlice = createSlice({
  name: "user",
  initialState: US,
  reducers: {
    addUser: (state, action) => {
      state.idUsuario = action.payload.idUsuario;
      state.institucion = action.payload.institucion;
      state.rol = action.payload.rol;
      state.token = action.payload.token;
      state.nombre = action.payload.nombre;
      state.apellido = action.payload.apellido;
      state.email = action.payload.email;
      state.loginMode = action.payload.loginMode;
    },
    deleteUser: (state, action) => {
      state.idUsuario = null;
      state.institucion = null;
      state.rol = null;
      state.token = null;
      state.nombre = null;
      state.apellido = null;
      state.email = null;
      state.loginMode = null;
    },
    updateUser: (state, action) => {
      state.nombre = action.payload.nombre;
      state.apellido = action.payload.apellido;
      state.email = action.payload.email;
    }
  },
});

export const { addUser, deleteUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
