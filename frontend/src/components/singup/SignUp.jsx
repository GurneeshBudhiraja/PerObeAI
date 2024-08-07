import React,{ useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import { Input, SignInGoogle } from '../components.js';
import {auth, fireStore } from "../../firebase/firebaseServices.js";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/authSlice/authSlice.js';

function SignUp() {
  const { handleSubmit, control,formState:{errors} } = useForm();
  const navigate = useNavigate()

  const signUpUser =  async (data,method)=>{
    try {
      let userCredentials = undefined;
      

      if(method==="google"){
        userCredentials = await auth.logInWithGoogle()
      } else{
        userCredentials = await auth.signUpWithEmail({email:data.email, password:data.password})
      }
      const user = userCredentials.user;
      
      // TODO: WILL CHANGE THE NAVIGATION FLOW

      const uid = user.uid;
      if(method!=="google"){
        // TODO: WILL CHECK WHETHER IS THERE ANY DATA EXITING IN THE FIRESTORE  FOR THE GOOGLE ACCOUNTS
        navigate("/login")
      }
      navigate("/")
      
    } catch (error) {
      console.log("Not able to create user", error.message)
    }

    
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-r from-[#beaae6] via-[#a7b8f3] to-[#B9C4ED] flex flex-col justify-center items-center">
        <div className='max-w-prose w-1/5 flex flex-col items-center justify-center space-y-20'>
          <p>
            Create an account
          </p>
          <form onSubmit={handleSubmit(signUpUser)}>
            <Controller 
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
                <Input 
                isRequired={true}
                type={"email"}
                labelName={"Email"}
                props={{onChange, onBlur, selected:value, }}
                />
              )}
            />

            <Controller 
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
                <Input 
                type={"password"}
                labelName={"Password"}
                isRequired={true}
                props={{onChange, onBlur, selected:value, }}
                />
              )}
            />
            <input type="submit" value="Sign up" />
          </form>
          <div>OR</div>
          <div>
            <SignInGoogle 
            onClick={()=>{signUpUser({},"google")}}
            />
          </div>
        </div>
      

    </div>
    )
  }
export default SignUp