import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

// Home constants
import { heroFeaturePoints } from "./homeConstants.js";

// Import actions for updating the authentication state in the store
import { setUser } from "../../store/authSlice/authSlice.js";

// Custom components
import {
  HeroPoints,
  SignInWithGoogleButton,
} from "../../components/components.js";

// Google sign in utility function
import googleSignIn from "../../utils/googleSignIn.js";

// Firebase services
import { auth, fireStore } from "../../firebase/firebaseServices.js";

function Home() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Current user from the store
  const { isAuth } = useSelector((state) => state.auth);

  const [show, setShow] = useState(false);
  const [userData, setUserData] = React.useState({});

  useEffect(() => {
    const getCurrentUser = async () => {
      const user = await auth.currentUser();

      if (!user) {
        return;
      }

      const { uid, email, accessToken } = user;

      setUserData({ uid, email, accessToken });

      const firestoreUserData = await fireStore.getData({ uid });

      // Updating the state
      setUserData((prev) => ({ ...prev, ...firestoreUserData.data }));

      // Check if the user is new
      if (!Object.keys(firestoreUserData).length) {
        return navigate("/get-started", {
          state: { uid, email, accessToken, fromHome: true },
        });
      }

      const { preferred_fashion_style, accessibility, city } =
        firestoreUserData;

      // Update the store
      dispatch(
        setUser({
          uid,
          email,
          preferred_fashion_style,
          accessibility,
          city,
          accessToken,
          isAuth: true,
        })
      );
    };

    setTimeout(() => {
      setShow(true);
    }, 500);

    getCurrentUser();
  }, [dispatch, navigate]);

  // Wrapper function to trigger the google sign in
  const googleSignInWrapper = async () => {
    const userData = await googleSignIn();

    // Redirect to the get started page for the new user
    if (userData.isNewUser) {
      return navigate("/get-started", {
        state: { userData, fromHomePage: true },
      });
    } else {
      // Refactoring the data for the store
      const { isNewUser, ...rest } = userData;
      dispatch(setUser(rest));
    }
    return;
  };

  return (
    <div className="max-h-fit w-screen text-zinc-100 lg:flex flex-wrap mt-[1.75rem] mb-6">
      <div
        className="flex flex-col lg:flex-row gap-10 w-full  items-start pl-7 lg:pl-[5rem] flex-wrap"
        id="hero-section-left"
      >
        <div className="flex flex-col gap-8 lg:flex-row w-full   ">
          <div className="flex flex-col tracking-wider gap-1 lg:w-1/2 ">
            <span className="text-4xl md:text-5xl lg:text-6xl font-semibold bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-500 text-transparent bg-clip-text">
              PerObe AI
            </span>
            <span className="text-base font-medium md:text-lg">
              AI for Your Wardrobe
            </span>
            <div className="max-w-full mt-4 space-y-4 px-2">
              {heroFeaturePoints.map((point, index) => (
                <HeroPoints
                  key={index}
                  text={point.text}
                  keypoints={point.keypoints}
                />
              ))}
            </div>
          </div>

          <div
            className={`mb-9 w-full md:w-auto ${
              show ? "opacity-100" : "opacity-0"
            } transition-all duration-200 ease-in max-w-fit `}
          >
            {isAuth ? (
              <div className="w-[300px] md:w-[400px] transition-all duration-200 ease-in-out  h-full flex justify-center items-center ">
                <button
                  className="poppins-regular bg-white text-black border-[1px] border-[#747674] rounded w-full text-sm py-3 hover:bg-gray-200 hover:shadow-gray-600 hover:shadow-2xl transition-all duration-200 ease-in-out"
                  onClick={() => {
                    navigate("/chat");
                  }}
                  style={{ marginBottom: "1rem" }}
                >
                  Chat
                </button>
              </div>
            ) : (
              <div className="flex flex-col justify-center gap-7 h-full">
                <div className="w-[300px] md:w-[400px] transition-all duration-200 ease-in-out ">
                  <SignInWithGoogleButton onClick={googleSignInWrapper} />
                </div>
                <button
                  className="poppins-regular bg-white text-black border-[1px] border-[#747674] rounded w-[300px] md:w-[400px] text-sm py-[0.55rem] hover:bg-gray-200 hover:shadow-gray-600 hover:shadow-2xl transition-all duration-200 ease-in-out active:bg-gray-300"
                  onClick={() => {
                    navigate("/login");
                  }}
                  style={{ marginBottom: "1rem" }} // Adding space below the button
                >
                  Access Testing Account
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;
