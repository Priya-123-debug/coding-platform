import { configureStore } from "@reduxjs/toolkit";
import authreducer from "./authSlice.js";
export const store = configureStore({
  reducer: {
    auth: authreducer,
  },
});
