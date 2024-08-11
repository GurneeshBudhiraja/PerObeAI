import React, { useEffect, useState } from "react";
import {
  HeroPoints,
  SignInWithGoogleButton,
} from "../../components/components.js";
import googleSignIn from "../../utils/googleSignIn.js";
import { auth, fireStore } from "../../firebase/firebaseServices.js";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";

import { setUser } from "../../store/authSlice/authSlice.js";

function Home() {
  const [show, setShow] = useState(false);
  const [userData, setUserData] = React.useState({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isAuth } = useSelector((state) => state.auth);

  useEffect(() => {
    const getCurrentUser = async () => {
      const user = await auth.currentUser();
      if (!user) {
        return;
      }
      const { uid, email } = user;
      console.log("User", user);

      setUserData({ uid, email });
      const firestoreData = await fireStore.getData({ uid });
      if (!Object.keys(firestoreData).length) {
        return navigate("/get-started",{state: {userData, fromHome: true}});
      }

      const { preferred_fashion_style, accessibility, city } =
        firestoreData.data;
      dispatch(
        setUser({ uid, email, preferred_fashion_style, accessibility, city })
      );
    };
    setTimeout(() => {
      setShow(true);
    }, 500);
    getCurrentUser();
  }, []);

  const googleSignInWrapper = async () => {
    const userData = await googleSignIn();

    if (userData.isNewUser) {
      return navigate("/get-started", {
        state: { userData, fromHomePage: true },
      });
    } else {
      const { isNewUser, ...rest } = userData;
      dispatch(setUser(rest));
    }
    return;
  };

  const heroFeaturePoints = [
    {
      text: "Access Your Wardrobe Anytime, Anywhere",
      keypoints: [
        "View and manage your uploaded clothing photos",
        "Seamlessly organize your wardrobe from anywhere",
      ],
    },
    {
      text: "Get Personalized Outfit Recommendations",
      keypoints: [
        "Suggestions based on your uploaded clothes",
        "Customized for your events and local weather conditions",
      ],
    },
    {
      text: "Inclusive Fashion Assistance for All",
      keypoints: [
        "Special support for blind and color blind users",
        "Accessibility features ensuring the best style advice for everyone",
      ],
    },
  ];

  return (
    <div className="max-h-fit w-screen text-zinc-100 flex flex-wrap mt-[1.75rem] ">
      <div
        className="flex flex-col gap-10 w-1/2 items-start pl-[5rem] flex-wrap "
        id="hero-section-left"
      >
        <div className="flex flex-col tracking-wider">
          <span className="text-6xl  font-semibold bg-gradient-to-r from-pink-500 via-purple-400 to-indigo-500 text-transparent bg-clip-text ">
            PerObe AI
          </span>
          <span className="font-medium text-lg ">AI for Your Wardrobe</span>
        </div>

        <div className="max-w-full ">
          {heroFeaturePoints.map((point, index) => {
            return (
              <HeroPoints
                key={index}
                text={point.text}
                keypoints={point.keypoints}
              />
            );
          })}
        </div>
        <div
          className={`mb-9 w-full ${
            show ? "opacity-100" : "opacity-0"
          } transition-all duration-200 ease-in`}
        >
          {isAuth ? (
            <button
              className="poppins-regular  bg-white text-black border-[1px] border-[#747674] rounded w-[400px] text-sm py-[0.57rem]  hover:bg-gray-200 hover:shadow-gray-600 hover:shadow-2xl transition-all duration-200 ease-in-out active:bg-gray-300"
              onClick={() => {
                navigate("/chat", { state: {fromHomePage: true} });
              }}
            >
              Chat
            </button>
          ) : (
            <div className="flex flex-col gap-7">
              <SignInWithGoogleButton onClick={googleSignInWrapper} />
              <button
                className="poppins-regular  bg-white text-black border-[1px] border-[#747674] rounded w-[400px] text-sm py-[0.57rem]  hover:bg-gray-200 hover:shadow-gray-600 hover:shadow-2xl transition-all duration-200 ease-in-out active:bg-gray-300"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Access Testing Account
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="w-1/2  flex justify-center" id="hero-section-right">
        {/* TODO: Add the pictures here once the app is ready */}
        <p className="text-gray-400">will add the image here</p>
      </div>
    </div>
  );
}

export default Home;
