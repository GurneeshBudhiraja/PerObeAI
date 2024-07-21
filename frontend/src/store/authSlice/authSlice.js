import { createSlice } from "@reduxjs/toolkit";

const initialState ={
 user: null,
 email: null,
 uid: null,
 isAuth: false,
}


export const authSlice = createSlice({
 name: 'auth',
 initialState,
 reducers:{
  setUser:(state,action)=>{
   state.user = action.payload.user;
   state.email = action.payload.email;
   state.uid = action.payload.uid;
   state.isAuth = true; 
  },
  logoutUser:(state)=>{
    state.uid = null;
    state.user = null;
    state.email = null;
    state.isAuth = false;
  }
}
});
export const {setUser,logoutUser} = authSlice.actions;
export default authSlice.reducer;