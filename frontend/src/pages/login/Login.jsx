import React, { useState } from "react";
import { useForm, Controller, set } from "react-hook-form";
import {
  Input,
  SignInWithGoogleButton,
  FormSubmitButton,
} from "../../components/components.js";
import { auth, fireStore } from "../../firebase/firebaseServices.js";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/authSlice/authSlice.js";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

function Login() {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const dispatch = useDispatch();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [success, setSuccess] = useState(false);

  const loginUser = async (data) => {
    try {
      setError("");
      setLoading(true);
      
      const { userEmail = "testing@perobeai.com", password } = data;
      
      if(userEmail !== "testing@perobeai.com"){
        setError("This is a testing account. Please use the testing account credentials to login.");
        setLoading(false);
        return;
      }
      const user = await auth.logInWithEmail({ email: userEmail, password });

      console.log("user", user); //TODO: will remove after testing
      const { uid, email } = user.user;
      console.log(uid);
      const firestoreUserData = await fireStore.getData({ uid });
      const { accessibility, city, preferred_fashion_style } =
        firestoreUserData;
      dispatch(
        setUser({ uid, email, accessibility, city, preferred_fashion_style })
      );
      setSuccess(true);

      setTimeout(() => {
        navigate("/chat");
      }, 1600);
    } catch (error) {
      console.log(error);
      setError("Failed to login. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="flex flex-col items-center justify-start gap-7 mt-5 w-full h-full p-5 md:p-0 ">
        <span className="text-[1.35rem] tracking-wider poppins-medium md:text-[1.5rem] md:tracking-widest md:font-semibold">
          Log in to the Testing Account
        </span>
        <form
          onSubmit={handleSubmit(loginUser)}
          className="flex flex-col justify-center items-center gap-6 mb-4 w-3/4"
        >
          <Controller
            control={control}
            name="userEmail"
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
                className={""}
                onBlur={onBlur}
                selected={value}
                disabled={loading}
                autoFocus
              />
            )}
          />
          <FormSubmitButton
            className={`bg-black text-white py-2 text-center cursor-pointer rounded-full active:bg-gray-900 w-full max-w-md ${
              loading ? "cursor-not-allowed" : "cursor-pointer"
            } `}
          />
        </form>
      </div>
      {success && (
        <Snackbar
          open={!!success}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={1200}
          onClose={() => setSuccess(false)}
        >
          <Alert
            onClose={() => setSuccess(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {"You have been logged in successfully!"}
          </Alert>
        </Snackbar>
      )}
      {error && (
        <Snackbar
          open={!!error}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={1800}
          onClose={() => setError("")}
        >
          <Alert
            onClose={() => setError("")}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>
      )}
    </>
  );
}

export default Login;
