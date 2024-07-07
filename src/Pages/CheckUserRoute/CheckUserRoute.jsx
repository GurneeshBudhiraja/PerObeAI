import React from 'react';
import { Outlet } from 'react-router-dom';
import {auth} from "../../Firebase/firebaseServices.js";
import { useDispatch } from 'react-redux';
import { setUser, logoutUser } from '../../store/authSlice/authSlice.js';


function CheckUserRoute() {
 const dispatch = useDispatch();
  React.useEffect(() => {
    const retrieveUser = async () => {
      try {
        const {displayName:user,email,uid} = await auth.currentUser();
        if([user,email,uid].some((element)=>!element)){
          dispatch(logoutUser());
        }
        dispatch(setUser({user,email,uid}));
      } catch (error) {
        console.log(error.message);
      }
    };
    retrieveUser();
  }, [dispatch]);
  return <Outlet />;
}

export default CheckUserRoute