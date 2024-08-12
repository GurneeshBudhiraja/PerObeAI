import React, { useState } from "react";
import { useLocation, Navigate, Link } from "react-router-dom";
import { Stepper, Step, Button } from "@material-tailwind/react";
import Backdrop from "@mui/material/Backdrop";
import { CircularProgress } from "@mui/material";
import {
  FirstStepperContent,
  SecondStepperContent,
} from "../../components/components.js";
import { useNavigate } from "react-router-dom";
import { storage, fireStore } from "../../firebase/firebaseServices.js";
import { useDispatch } from "react-redux";
import { setUser } from "../../store/authSlice/authSlice.js";

function GetStarted() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const [userData, setUserData] = useState({
    city: "",
    accessibility: "",
    preferred_fashion_style: "",
  });

  React.useEffect(() => {
    if(!location?.state?.fromHome){
      return navigate("/");
    }
    console.log(location?.state);

    // TODO: will remove this after the testing
    const {uid, email} = location?.state;
    
    console.log("User found", uid, email);

    setUserData({ ...userData , uid, email });
    
    
  }, []);

  const [canProceed, setCanProceed] = React.useState(true);
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);

  const handleNext = async () => {
    try {
      if (!isLastStep) {
        setActiveStep((cur) => cur + 1);
      } else {
        console.log("loading");
        setIsLoading(true);
        const formattedData = {};

        // formatting the data for the store
        formattedData.accessibility =
          (userData?.accessibility?.accessibility === "Color Blind"
            ? userData?.colorBlindnessType?.colorBlindnessType
            : userData?.accessibility?.accessibility) || "";

        formattedData.city = userData.city;
        formattedData.preferred_fashion_style =
          userData.preferred_fashion_style;
        formattedData.uid = userData.uid;
        formattedData.email = userData.email;

        dispatch(setUser({ ...formattedData }));

        const { city, accessibility, preferred_fashion_style } = formattedData;
        const resp = await fireStore.addData({
          uid: formattedData.uid,
          data: { city, accessibility, preferred_fashion_style },
        });
        console.log("Data added to the store", resp);

        const imageURLs = await storage.getPictures({ uid: formattedData.uid });
        console.log("Image URLs", imageURLs);

        const url = `http://127.0.0.1:8000/api/web/v1/image-embeddings?user_id=${formattedData.uid}`;
        console.log("making request to URL", url);
        const vector_db_resp = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(imageURLs),
        });
        const vector_db_resp_json = await vector_db_resp.json();

        // TODO: will add the error handling later on
        if (Object.keys(vector_db_resp_json).length) {
          navigate("/chat");
        } else {
          console.log("Error in vector_db_resp_json", vector_db_resp_json);
          navigate("/");
        }
      }
    } catch (error) {
      console.log("Error in handleNext", error);
    } finally {
      setIsLoading(false);  
    }
  };

  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <FirstStepperContent uid={userData.uid} canProceed={setCanProceed} />
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
          src="../../../assets/perobeai-logo-small.svg"
          alt="PerobeAI Logo"
          className="h-20 max-w-prose object-contain"
        />
      </Link>
      <div className="w-[90%] h-[75%] max-w-3xl mx-auto py-8 px-6 shadow-sm rounded-lg backdrop-blur-3xl bg-white/40">
        {isLoading && (
          <div className="text-gray-600 font-medium text-center mb-4">
            {/* will change this later on */}
            Processing your input...
          </div>
        )}
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
                ? "bg-[#C4B5FD] text-[#5B21B6]" // Light Purple Background with Darker Purple Text
                : "bg-[#E0E7FF] text-[#1E3A8A]" // Lighter Blue Background with Darker Blue Text
            }`}
          >
            <div className="font-medium">1</div>
          </Step>
          <Step
            onClick={() => setActiveStep(1)}
            className={`cursor-pointer flex items-center justify-center w-10 h-10 rounded-full ${
              activeStep === 1
                ? "bg-[#C4B5FD] text-[#5B21B6]" // Light Purple Background with Darker Purple Text
                : "bg-[#E0E7FF] text-[#1E3A8A]" // Lighter Blue Background with Darker Blue Text
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
                ? "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed" // Light Gray Background with Medium Gray Text
                : "bg-[#F3F4F6] text-[#374151] hover:bg-[#E5E7EB]" // Very Light Gray Background with Darker Gray Text
            }`}
          >
            Prev
          </Button>
          <Button
            onClick={handleNext}
            disabled={!canProceed}
            className={`px-5 py-2 rounded-lg transition-all duration-200 ease-in-out shadow-sm ${
              canProceed
                ? "bg-[#6366F1] text-white hover:bg-[#4F46E5]" // Indigo Background with White Text
                : "bg-[#E5E7EB] text-[#9CA3AF] cursor-not-allowed" // Light Gray Background with Medium Gray Text
            } ${isLastStep && "bg-[#10B981] hover:bg-[#059669]"}`} // Green Background with Hover Effect for Submit
          >
            {!isLastStep ? "Next" : "Submit"}
          </Button>
        </div>
      </div>
      {isLoading && <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={isLoading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>}
    </div>
  );
}

export default GetStarted;
