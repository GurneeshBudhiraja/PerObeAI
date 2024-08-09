import React,{ useState } from 'react';
import { useForm, Controller, set } from "react-hook-form";
import { Input, SignInWithGoogleButton, FormSubmitButton } from '../../components/components.js';
import {auth, fireStore } from "../../firebase/firebaseServices.js";
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../store/authSlice/authSlice.js';

function SignUp() {
  const { handleSubmit, control , formState:{errors} } = useForm();
  const navigate = useNavigate()

  const signUpUser =  async (data,method)=>{
    try {

      let userCredentials = undefined;
      
      if(data.password!==data.confirmPassword){
        // TODO: WILL ADD THE ERROR MESSAGE
        console.log("Password and Confirm Password does not match")
        return;
      }

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
    <div className="flex flex-col items-center justify-center gap-2 ">
      <span className="text-[1.5rem] tracking-widest font-semibold -mt-16 mb-9 ">
        Create Your Account
      </span>
      <form
        onSubmit={handleSubmit(signUpUser)}
        className="flex flex-col gap-6 min-w-[25rem] mb-4 "
      >
        <Controller
          control={control}
          rules={{ required: "Email is required" }}
          name="email"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              // TODO: will add the error here
              isRequired={true}
              type={"email"}
              labelName={"Email"}
              onBlur={onBlur}
              onChange={onChange}
              selected={value}
            />
          )}
        />
        <Controller
          control={control}
          name="password"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              // TODO: will add the error here
              type={"password"}
              labelName={"Password"}
              isRequired={true}
              onChange={onChange}
              onBlur={onBlur}
              selected={value}
            />
          )}
        />
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, onBlur, value } }) => (
            <Input
              // TODO: will add the error here
              type={"password"}
              labelName={"Confirm Password"}
              isRequired={true}
              onChange={onChange}
              onBlur={onBlur}
              selected={value}
            />
          )}
        />
        <FormSubmitButton
          className={
            " bg-black text-white py-2 text-center cursor-pointer rounded-full active:bg-gray-900"
          }
        />
      </form>
      <div >
        <div className="flex items-center justify-center w-full mb-6 ">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-4 text-gray-500">or</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>
        <div>
          <SignInWithGoogleButton
            onClick={() => {
              signUpUser({}, "google");
            }}
          />
        </div>
      </div>
    </div>
    )
  }
export default SignUp