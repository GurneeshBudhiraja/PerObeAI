import React, { useState } from "react";
import { useLocation, Link } from "react-router-dom";
import { Stepper, Step, Button } from "@material-tailwind/react";
import Backdrop from "@mui/material/Backdrop";
import { CircularProgress } from "@mui/material";
import { Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/authSlice/authSlice.js";

import { imageEmbeddingsURL } from "../../utils/urlConstants.js";

// Firebase services
import { storage, fireStore, auth } from "../../firebase/firebaseServices.js";

// Custom components
import {
  FirstStepperContent,
  SecondStepperContent,
} from "../../components/components.js";

// Utility function for title casing
import { titleCase } from "../accountSettings/accountSettingsUtils/accountSettingsUtils.js";

// App logos
import { BigLogo, SmallLogo } from "../../../assets/assets.jsx";

function GetStarted() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [canProceed, setCanProceed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [isLastStep, setIsLastStep] = useState(false);
  const [isFirstStep, setIsFirstStep] = useState(false);

  const [userData, setUserData] = useState({
    city: "",
    accessibility: "",
    preferred_fashion_style: "",
  });

  React.useEffect(() => {
    // Redirect to the home page if the user tries to access this page directly
    if (!location?.state?.fromHome) {
      return navigate("/");
    }

    const getCurrentUser = async () => {
      const {
        uid = undefined,
        email = undefined,
        accessToken = undefined,
      } = await auth.currentUser();

      // Check if the user is authenticated
      if (!uid || !email || !accessToken) {
        return navigate("/");
      }
      // Update the store
      setUserData((prev) => ({ ...prev, uid, email, accessToken }));
    };

    getCurrentUser();
  }, [navigate, location?.state?.fromHome]);

  const handleNext = async () => {
    try {
      // Keep track of the active step
      if (!isLastStep) {
        setActiveStep((cur) => cur + 1);
      } else {
        setIsLoading(true);
        const formattedData = {};

        // formatting the data for the store
        formattedData.accessibility =
          (userData?.accessibility?.accessibility === "Color Blind"
            ? titleCase(userData?.colorBlindnessType?.colorBlindnessType)
            : titleCase(userData?.accessibility?.accessibility)) || "";

        formattedData.city = titleCase(userData.city);

        formattedData.preferred_fashion_style = titleCase(
          userData.preferred_fashion_style
        );

        formattedData.uid = userData.uid;

        formattedData.email = userData.email;

        formattedData.accessToken = userData.accessToken;

        // Update the store
        dispatch(setUser({ ...formattedData, isAuth: true }));

        // Add the data to the firestore
        const { city, accessibility, preferred_fashion_style } = formattedData;

        await fireStore.addData({
          uid: formattedData.uid,
          data: { city, accessibility, preferred_fashion_style },
        });

        // Get the image URLs for generating and storing the embeddings
        const imageURLs = await storage.getPictures({ uid: formattedData.uid });

        const url = imageEmbeddingsURL;

        const vector_db_resp = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            // update this
            "Authorization": `Bearer ${userData?.accessToken}`,
          },
          body: JSON.stringify(imageURLs),
        });

        const vector_db_resp_json = await vector_db_resp.json();

        // Show the success message
        setSuccess("Preferences saved successfully");

        // Redirect to the chat page
        if (Object.keys(vector_db_resp_json).length) {
          setTimeout(() => {
            navigate("/chat");
          }, 1000);
        } else {
          // Show the error message
          setError("Something went wrong. Please try again");

          // Redirect to the home page
          setTimeout(() => {
            navigate("/");
          }, 500);
        }
      }
    } catch (error) {
      setError("Something went wrong. Please try again");
    } finally {
      setIsLoading(false);
    }
  };

  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

  // Render the content based on the active step
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <FirstStepperContent
            uid={userData.uid}
            canProceed={setCanProceed}
            setIsLoading={setIsLoading}
            setError={setError}
            setSuccess={setSuccess}
          />
        );
      case 1:
        return (
          <SecondStepperContent
            canProceed={setCanProceed}
            userData={userData}
            setUserData={setUserData}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="bg-gradient-to-br from-[#f5cd9bd0] via-[#ffdde4bd] to-[#e2f1fbd4] w-full h-full flex flex-col items-start ">
      <Link to={"/"} className="">
        <img
          src={SmallLogo}
          alt="PerobeAI Logo"
          className="h-20 max-w-prose object-contain lg:hidden inline-block"
        />
        <img
          src={BigLogo}
          alt="PerobeAI Logo"
          className="h-28 w-44 object-contain hidden lg:inline-block"
        />
      </Link>
      <div className="w-[90%] h-[75%] max-w-3xl mx-auto py-8 px-6 shadow-sm rounded-lg backdrop-blur-3xl bg-white/40">
        <Stepper
          activeStep={activeStep}
          isLastStep={(value) => setIsLastStep(value)}
          isFirstStep={(value) => setIsFirstStep(value)}
          className="mb-8 flex justify-around overflow-hidden"
        >
          <Step
            onClick={() => setActiveStep(0)}
            readonly
            className={`cursor-pointer flex items-center justify-center w-10 h-10 rounded-full ${
              activeStep === 0
                ? "bg-[#C4B5FD] text-[#5B21B6]"
                : "bg-[#E0E7FF] text-[#1E3A8A]"
            }`}
          >
            <div className="font-medium">1</div>
          </Step>
          <Step
            onClick={() => setActiveStep(1)}
            className={`cursor-pointer flex items-center justify-center w-10 h-10 rounded-full ${
              activeStep === 1
                ? "bg-[#C4B5FD] text-[#5B21B6]"
                : "bg-[#E0E7FF] text-[#1E3A8A]"
            }`}
          >
            <div className="font-medium">2</div>
          </Step>
        </Stepper>
        <div className="h-1/2">{renderStepContent()}</div>
        <div className="fixed bottom-[3rem] flex items-center w-full justify-between left-1/2 -translate-x-1/2 px-7 ">
          <Button
            onClick={handlePrev}
            disabled={isFirstStep}
            className={`px-5 py-2 rounded-lg transition-all duration-200 ease-in-out shadow-sm ${
              isFirstStep
                ? "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
                : "bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB]"
            }`}
          >
            Prev
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className={`px-5 py-2 rounded-lg transition-all duration-200 ease-in-out shadow-sm ${
              canProceed
                ? "bg-[#6366F1] text-white hover:bg-[#4F46E5]"
                : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed"
            } ${isLastStep && "bg-[#10B981] hover:bg-[#059669]"}`}
          >
            {!isLastStep ? "Next" : "Submit"}
          </Button>
        </div>
      </div>

      {/* ui features */}
      {isLoading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={isLoading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}
      {error && (
        <Snackbar
          open={!!error}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={1500}
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
      {success && (
        <Snackbar
          open={!!success}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={1500}
          onClose={() => setSuccess(false)}
        >
          <Alert
            onClose={() => setSuccess(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {success}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
}

export default GetStarted;
