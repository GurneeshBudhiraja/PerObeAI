import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";
import { VoiceChat } from "../pages.js";
import {auth} from "../../firebase/firebaseServices.js";

// components and icons
import { InputText } from "primereact/inputtext";
import SendIcon from "@mui/icons-material/Send";
import { SamplePrompt } from "../../components/components";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Menu } from "../../components/components.js";
import { Dropdown } from "primereact/dropdown";

function Chat() {
  const dispatch = useDispatch();
  const [unmountRecommendation, setUnmountRecommendation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [recommendation, setRecommendation] = useState("");
  const [error, setError] = useState("");
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState([]);
  const inputRef = useRef(null);
  const buttonRef = useRef(null);
  const options = ["Chat", "Voice"];
  const navigate = useNavigate();
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const { isAuth, uid, accessibility, city, preferred_fashion_style } = useSelector((state)=>state.auth);


  const getImages = async () => {
    try {
      console.log("Getting images");
      const uid = userData?.uid;
      const outfit_description = recommendation;

      const url = `https://perobeai-bhgx.onrender.com/api/web/v1/get-images?user_id=${uid}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ outfit_description }),
      });

      const imagesData = await response.json();
      console.log(imagesData);

      if (imagesData?.image_urls?.length) {
        setImages(imagesData.image_urls);
        setRecommendation("");
      } else {
        setError("No images found. Please try again.");
      }
      console.log(imagesData);
    } catch (error) {
      setError("Error in getting images. Please try again later.");
    }
  };

  useEffect(() => {
    if(!isAuth){
      return navigate("/");
    }
    
  }, []);

  const getRecommendation = async () => {
    try {
      // for preventing the sample prompt from being shown
      setImages([]);
      setLoading(true);
      if (!prompt.trim()) {
        setError("Please enter a prompt");
        return;
      }

      const requestBody = JSON.stringify({
        user_prompt: prompt.trim(),
        city: userData?.city,
        preferred_fashion_style: userData?.preferred_fashion_style,
        accessibility: userData?.accessibility,
      });

      const uid = userData?.uid;
      const url = `https://perobeai-bhgx.onrender.com/api/web/v1/recommend?user_id=${uid}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });

      const data = await response.json();
      if (!data?.response) {
        throw new Error("Something went wrong. Please try again later.");
      }

      setUnmountRecommendation(true);

      setTimeout(() => {
        setRecommendation(data?.response);
        setUnmountRecommendation(false);
      }, 450);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
      setPrompt("");
      setTimeout(() => {
        inputRef?.current?.focus();
      }, 0);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && prompt) {
      getRecommendation();
    }
  };

  return (
    <>
      <div className="bg-[#131314] h-full w-full text-[#eeeeee] flex flex-col justify-center items-center relative">
        <div className="flex w-full items-center justify-between p-3 bg-white shadow-lg shadow-gray-800/30 z-10">
          <Link to={"/"} className="max-h-10 overflow-hidden">
            <img
              src="../../../assets/perobeai-logo-small.svg"
              alt="PerobeAI Logo"
              className="h-14 max-w-prose object-contain ml-7"
            />
          </Link>
          <div className="flex justify-center items-center text-end w-10 ">
            <Menu className="ml-auto" />
          </div>
        </div>
        <div className="z-20 mt-5 sm:mt-12 fixed top-14 left-4">
          <Dropdown
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.value)}
            options={options}
            optionLabel="name"
            checkmark={true}
            className="py-1 px-2 hover:bg-gray-700 bg-gray-800 text-white border-[1px] border-gray-600 rounded-lg shadow-lg tracking-widest z-20"
            panelClassName="bg-gray-800 text-white border-[1px] border-gray-600 rounded-lg shadow-lg mt-1 pl-3 pb-2 z-50"
          />
        </div>

        {selectedOption === "Voice" ? (
          <VoiceChat />
        ) : (
          <div className="h-full flex flex-col justify-center items-center transition-all duration-300 ease-out max-w-prose">
            {images.length > 0 ? (
              <div className="grid grid-cols-2 gap-4 p-4 overflow-auto w-full sm:w-3/4 md:w-2/3 lg:w-1/2">
                {images.map((image, index) => (
                  <img
                    key={index}
                    src={image.url}
                    alt={`Outfit ${index + 1}`}
                    className="w-full h-full object-cover rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 ease-in-out"
                  />
                ))}
              </div>
            ) : (
              recommendation && (
                <div
                  className={`text-[#eeeeee] animate-slide-in-bottom flex flex-col items-start gap-5 px-8 ${
                    !unmountRecommendation ? "opacity-100" : "opacity-0"
                  } transition-all duration-500 ease-in-out`}
                >
                  {recommendation}
                  <button
                    className="bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 text-gray-800 font-medium py-2 px-6 rounded-lg shadow transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-lg active:scale-95"
                    onClick={getImages}
                  >
                    Get Pictures of the recommended outfit
                  </button>
                </div>
              )
            )}

            {!recommendation && !images.length && (
              <div className="space-y-4">
                {[
                  "What should I wear to a summer wedding?",
                  "Give me an outfit idea for a first date.",
                  "How can I accessorize a little black dress?",
                  "What should I wear on a rainy day?",
                ].map((samplePrompt, index) => (
                  <SamplePrompt
                    key={index}
                    samplePrompt={samplePrompt}
                    onClick={() => {
                      setPrompt(samplePrompt);
                      setTimeout(() => {
                        getRecommendation();
                      }, 500);
                    }}
                    className="bg-gray-100 hover:bg-gray-200 text-gray-800 font-medium py-2 px-4 mx-6 rounded-lg shadow-sm cursor-pointer transition-all duration-300 ease-in-out transform hover:-translate-y-1 hover:scale-105 hover:shadow-md"
                  />
                ))}
              </div>
            )}

            {error && (
              <Snackbar
                open={!!error}
                anchorOrigin={{ vertical: "top", horizontal: "right" }}
                autoHideDuration={3300}
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

            <div
              className={`w-4/5 md:w-3/4 lg:w-2/4 h-[3rem] flex items-center justify-center fixed bottom-10 left-1/2 -translate-x-1/2 ${
                loading ? "cursor-not-allowed" : "cursor-auto"
              }`}
            >
              <InputText
                ref={inputRef}
                disabled={loading}
                autoFocus
                placeholder="Need outfit advice? Ask here..."
                className="outline-none w-full bg-[#212121] border-[1px] border-gray-200 rounded-full p-4 focus:bg-[#343333c0] transition-all duration-100 ease-in-out tracking-normal poppins-regular hover:bg-[#3433338f] flex-grow pr-16 "
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                onKeyDown={handleKeyDown}
              />
              <button
                ref={buttonRef}
                className={`ml-2 absolute right-6 ${
                  !prompt || loading
                    ? "opacity-50 cursor-not-allowed"
                    : "opacity-100 cursor-pointer"
                } outline-blue-700`}
                onClick={getRecommendation}
                disabled={!prompt || loading}
              >
                {!loading ? (
                  <SendIcon />
                ) : (
                  <CircularProgress size={30} style={{ color: "#D46676" }} />
                )}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export default Chat;
