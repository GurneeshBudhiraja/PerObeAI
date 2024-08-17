import React, { useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert } from "@mui/material";

// Import actions for updating the authentication state in the store
import { setUser } from "../../store/authSlice/authSlice.js";

// Custom components
import { Input, FormSubmitButton } from "../../components/components.js";

// Firebase services
import { auth, fireStore } from "../../firebase/firebaseServices.js";

function Login() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm();

  const loginUser = async (data) => {
    try {
      setError("");
      setLoading(true);

      // Destructure the userEmail and password from the form data
      const { userEmail = "testing@perobeai.com", password } = data;

      // Allow only the testing account to login
      if (userEmail !== "testing@perobeai.com") {
        setError(
          "This is a testing account. Please use the testing account credentials to login."
        );
        setLoading(false);
        return;
      }

      const user = await auth.logInWithEmail({ email: userEmail, password });

      const { uid, email } = user.user;

      const firestoreUserData = await fireStore.getData({ uid });

      // Desctructure the user choices/data from the firestore
      const { accessibility, city, preferred_fashion_style } =
        firestoreUserData;

      dispatch(
        setUser({ uid, email, accessibility, city, preferred_fashion_style })
      );

      // Redirect to the chat page after successful login
      setTimeout(() => {
        navigate("/chat");
      }, 200);
    } catch (error) {
      // TODO: will remove this after testing
      console.log(error.message);
      if (error.code === "auth/too-many-requests") {
        // Handle too many incorrect attempts, prompting a temporary account lock
        setError(
          "This account has been disabled. Please try again after some time."
        );
      } else if (error.code === "auth/user-disabled") {
        // Checking for the disabled accounts
        setError("This account has been disabled.");
      } else if (error.code === "auth/invalid-credential") {
        // Checking for the wrong password
        setError("Incorrect password. Please try again.");
      } else {
        // For the rest of the errors
        setError("Something went wrong. Please try again later.");
      }
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
