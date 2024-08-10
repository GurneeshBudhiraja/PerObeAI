import React, { useState } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { Stepper, Step, Button } from "@material-tailwind/react";
import {
  FirstStepperContent,
  SecondStepperContent,
  ThirdStepperContent,
} from "../../components/components.js";

function GetStarted() {
  const location = useLocation();
  const [userData, setUserData] = useState({});
  React.useEffect(() => {
    setUserData(location?.state?.userData);
  }, []);
  const [canProceed, setCanProceed] = React.useState(true);
  const [activeStep, setActiveStep] = React.useState(0);
  const [isLastStep, setIsLastStep] = React.useState(false);
  const [isFirstStep, setIsFirstStep] = React.useState(false);

  const handleNext = () => !isLastStep && setActiveStep((cur) => cur + 1);
  const handlePrev = () => !isFirstStep && setActiveStep((cur) => cur - 1);
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <FirstStepperContent uid={userData.uid} canProceed={setCanProceed}/>
        );
      case 1:
        return <SecondStepperContent userData={userData} />;
      case 2:
        return <ThirdStepperContent />;
      default:
        return <FirstStepperContent />;
    }
  };

  return location?.state?.fromHomePage ? (
    // TODO: create the signin flow
    <div className="w-full py-4 px-8">
      <Stepper
        activeStep={activeStep}
        isLastStep={(value) => setIsLastStep(value)}
        isFirstStep={(value) => setIsFirstStep(value)}
      >
        <Step onClick={() => setActiveStep(0)}>1</Step>
        <Step onClick={() => setActiveStep(1)}>2</Step>
        <Step onClick={() => setActiveStep(2)}>3</Step>
      </Stepper>
      <div className="mt-8">{renderStepContent()}</div>
      <div className="mt-16 flex justify-between">
        <Button onClick={handlePrev} disabled={isFirstStep}>
          Prev
        </Button>
        <Button onClick={handleNext} disabled={isLastStep || !canProceed}>
          Next
        </Button>
      </div>
    </div>
  ) : (
    // TODO: will look for the redirect page later on
    <Navigate to="/" />
  );
}

export default GetStarted;
