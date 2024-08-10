import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {auth, fireStore} from "../firebase/firebaseServices.js";
import { useNavigate } from "react-router-dom";
import { Outlet, Navigate } from "react-router-dom";
import { setUser } from "../store/authSlice/authSlice.js";

const ProtectedRoutes = () => {
  const [userData, setUserData] = useState({});
  const dispatch = useDispatch();
  const {isAuth} = useSelector((state) => state.auth);
  const navigate = useNavigate();
  useEffect(()=>{
    const getCurrentUser = async () =>{
      const user = true;
      if(!user){
        return navigate("/");
      }
      const {uid, email} = user;
      console.log(uid, email);
      setUserData({...userData, uid, email});
      // getting the user preferences from firestore
      const firestoreData = await fireStore.getData({uid});
      
      // will navigate to get-started if user is new
      if(!Object.keys(firestoreData).length){
        return navigate("/get-started",{state: {userData, fromProtectedRoute: true}});
      }
      const {preferred_fashion_style, accessibility, city} = firestoreData.data;
      
      setUserData({...userData, preferred_fashion_style, accessibility, city});

      dispatch(setUser({...userData}));

    }
    getCurrentUser();
  },[navigate, dispatch, userData]);
  
  return(
    <div>
      <button onClick={()=>{
        console.log(userData);
      }}>
        Click
      </button>
    </div>
  )
  
}

export default ProtectedRoutes;
