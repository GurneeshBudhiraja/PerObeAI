import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import {
  Input,
  SignInWithGoogleButton,
  FormSubmitButton,
} from "../../components/components.js";
import { auth, fireStore } from "../../firebase/firebaseServices.js";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/authSlice/authSlice.js";
import { useNavigate } from "react-router-dom";

function Login({ email }) {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const loginUser = async (data, method) => {
    try {
      let userCredentials = undefined;

      if (method === "google") {
        userCredentials = await auth.logInWithGoogle();
      } else {
        userCredentials = await auth.logInWithEmail(data.email, data.password);
      }
      const user = userCredentials.user;

      const uid = user.uid;
      const email = user.email;

      const userData = await fireStore.getData({ uid });

      const dispatchData = {
        uid,
        email,
        preferredStyle: userData.preferred_fashion_style,
        accessibility: userData.accessibility,
        city: userData.city,
      };

      dispatch(setUser({ ...dispatchData }));

      console.log(user);
      navigate("/");
    } catch (error) {
      console.log("Not able to fetch user", error.message);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 ">
      <span className="text-[1.5rem] tracking-widest font-semibold">
        Log In to Your Account
      </span>
      <form
        onSubmit={handleSubmit(loginUser)}
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
              value={"testing@perobeai.com"}
              type={"email"}
              disabled={true}
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
              autoFocus
            />
          )}
        />
        <FormSubmitButton
          className={
            " bg-black text-white py-2 text-center cursor-pointer rounded-full active:bg-gray-900"
          }
        />
      </form>
    </div>
  );
}

export default Login;
