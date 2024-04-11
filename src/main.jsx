import React from "react";
import App from "./App";

import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./components/redux/userSlice";

import { BrowserRouter } from "react-router-dom";
import { store } from "./components/redux/store";

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Provider store={store}>
      <App />
    </Provider>
  </BrowserRouter>
);
