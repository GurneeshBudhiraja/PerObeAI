import React, { useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { Stepper, Step, Button } from "@material-tailwind/react";
import {
  FirstStepperContent,
  SecondStepperContent,
} from "../../components/components.js";
import { useNavigate } from "react-router-dom";
import {storage, fireStore} from "../../firebase/firebaseServices.js";
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
    setUserData({ ...userData, ...location?.state?.userData });
    console.log("Location state", location?.state?.userData);
  }, []);
  // TODO: will turn to false once the code is done
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
        setIsLoading(true);
        const formattedData={}
        
        // formatting the data for the store
        formattedData.accessibility = (userData?.accessibility?.accessibility==="Color Blind" ?  userData?.colorBlindnessType?.colorBlindnessType : userData?.accessibility?.accessibility) || ""
        
        formattedData.city=  userData.city
        
        formattedData.preferred_fashion_style =  userData.preferred_fashion_style,
        
        formattedData.uid =  userData.uid
        
        formattedData.email =  userData.email
        
        dispatch(setUser({ ...formattedData }));
        
        const {city, accessibility, preferred_fashion_style} = formattedData;
        const resp = await fireStore.addData({uid:formattedData.uid, data:{city, accessibility, preferred_fashion_style}});
        console.log("Data added to the store", resp);
        const imageURLs = await storage.getPictures({uid:formattedData.uid});
        console.log("Image URLs", imageURLs);
        const url = `http://127.0.0.1:8000/api/web/v1/image-embeddings?user_id=${formattedData.uid}`;
        const vector_db_resp = await fetch(url, {
          method: "POST",
          
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify( imageURLs ),
        })
        const vector_db_resp_json = await vector_db_resp.json();

        // TODO: will add the error handling later on
        if(Object.keys(vector_db_resp_json).length){
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
    }
  };

  // will add the home route option only here
  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-6 bg-white shadow-lg rounded-lg">
    {isLoading && (
      <div className="text-blue-600 font-medium text-center mb-4">
        Processing the input...
      </div>
    )}
    <Stepper
      activeStep={activeStep}
      isLastStep={(value) => setIsLastStep(value)}
      isFirstStep={(value) => setIsFirstStep(value)}
      className="mb-8"
    >
      <Step onClick={() => setActiveStep(0)} readonly className="cursor-pointer">
        <div className={`text-center font-semibold ${activeStep === 0 ? "text-blue-600" : "text-gray-600"}`}>
          1
        </div>
      </Step>
      <Step onClick={() => setActiveStep(1)} className="cursor-pointer">
        <div className={`text-center font-semibold ${activeStep === 1 ? "text-blue-600" : "text-gray-600"}`}>
          2
        </div>
      </Step>
    </Stepper>
    <div className="mt-8">
      {renderStepContent()}
    </div>
    <div className="mt-12 flex justify-between items-center">
      <Button
        onClick={handlePrev}
        disabled={isFirstStep}
        className={`px-6 py-2 rounded-lg transition-all duration-200 ease-in-out ${isFirstStep ? "bg-gray-300 cursor-not-allowed" : "bg-gray-600 text-white hover:bg-gray-700"}`}
      >
        Prev
      </Button>
      <Button
        onClick={handleNext}
        disabled={!canProceed}
        className={`px-6 py-2 rounded-lg transition-all duration-200 ease-in-out ${canProceed ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 cursor-not-allowed"} ${isLastStep && "bg-green-600 hover:bg-green-700"}`}
      >
        {!isLastStep ? "Next" : "Submit"}
      </Button>
    </div>
  </div>
  
  ) 
}

export default GetStarted;
