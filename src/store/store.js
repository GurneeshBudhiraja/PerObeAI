import { configureStore } from '@reduxjs/toolkit'
import authReducer from "./authSlice/authSlice.js";
export default configureStore({
  reducer: {
    auth: authReducer,
  },
})
