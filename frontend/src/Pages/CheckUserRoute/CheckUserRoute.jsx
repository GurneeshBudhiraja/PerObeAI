import React from 'react';
import { Outlet } from 'react-router-dom';
import {auth} from "../../Firebase/firebaseServices.js";
import { useDispatch } from 'react-redux';
import { setUser, logoutUser } from '../../store/authSlice/authSlice.js';


function CheckUserRoute() {
  const [isAuth, setIsAuth] = React.useState(false); // boolean to check if the user is authenticated
  const dispatch = useDispatch();
  React.useEffect(() => {
    const retrieveUser = async () => {
      try {
        const {displayName:user,email,uid} = await auth.currentUser();
        if([user,email,uid].some((element)=>!element)){
          dispatch(logoutUser());
          setIsAuth(false);
        }
        dispatch(setUser({user,email,uid}));
        setIsAuth(true);
      } catch (error) {
        console.log(error.message);
      }
    };
    retrieveUser();
  }, [dispatch]);
  return isAuth?<Outlet />:<h1>Welcome to PerObe AI. Your Personal wardrobe assistant in your pocket</h1>;
}

export default CheckUserRoute