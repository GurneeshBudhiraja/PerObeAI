import React from 'react'
import  GoogleButton from "react-google-button";
import {auth} from "../../Firebase/firebaseServices.js";
import {useDispatch} from "react-redux";
import { setUser } from "../../store/authSlice/authSlice.js";
import { useNavigate } from 'react-router-dom';
function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const logGoogleUser = async () => {
    try {
      const result = await auth.logInWithGoogle();
      const {displayName:user,email,uid} = result.user;
      if([user,email,uid].some((element)=>!element)){
        throw new Error("SignIn :: Error in fetching user data");
      } 
      dispatch(setUser({user,email,uid}));
      console.log(result);
      navigate('/');
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <>
      <GoogleButton onClick={logGoogleUser} />
    </>
  )
}

export default Login