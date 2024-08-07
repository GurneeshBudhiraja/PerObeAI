import React,{ useState } from 'react';
import { useForm, Controller } from "react-hook-form";
import { Input, SignInGoogle } from '../components.js';
import {auth,fireStore} from "../../firebase/firebaseServices.js";
import { useDispatch } from 'react-redux'
import { setUser } from "../../store/authSlice/authSlice.js";
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loginError, setLoginError] = useState('')
  const { handleSubmit, control,formState:{errors} } = useForm();
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const loginUser =  async (data,method)=>{
    try {
      let userCredentials = undefined;
      
      if(method==="google"){
        userCredentials = await auth.logInWithGoogle()
      } else{
        userCredentials = await auth.logInWithEmail(data.email, data.password)
      }
      const user = userCredentials.user;
      
      const uid = user.uid;
      const email = user.email;

      const userData = await fireStore.getData({uid})
      
      const dispatchData = {uid, email, preferredStyle:userData.preferred_fashion_style, accessibility:userData.accessibility, city:userData.city}

      dispatch(setUser({...dispatchData}))
      
    } catch (error) {
      console.log("Not able to fetch user", error.message)
    }

    
  }

  return (
    <div className="h-screen w-screen bg-gradient-to-r from-[#beaae6] via-[#a7b8f3] to-[#B9C4ED] flex flex-col justify-center items-center">
        <div className='max-w-prose w-1/5 flex flex-col items-center justify-center space-y-20'>
          <p>
            Log in to your account
          </p>
          <form onSubmit={handleSubmit(loginUser)}>
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
            <input type="submit" value="Login" />
          </form>
          <div>OR</div>
          <div>
            <SignInGoogle 
            onClick={()=>{loginUser({},"google")}}
            />
          </div>
        </div>
      

    </div>
  )
}

export default Login