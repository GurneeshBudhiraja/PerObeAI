import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Dropdown } from "primereact/dropdown";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { getImagesURL, recommendationUrl } from "../../utils/urlConstants.js";
import { setUser } from "../../store/authSlice/authSlice.js";

// Firebase services
import { auth, fireStore } from "../../firebase/firebaseServices.js";

// Custom components/pages
import { VoiceChat } from "../pages.js";
import { InputText } from "primereact/inputtext";
import { SamplePrompt } from "../../components/components";
import { Menu } from "../../components/components.js";

function Chat() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [userData, setUserData] = useState({});
  const [recommendation, setRecommendation] = useState("");
  const [error, setError] = useState("");
  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState([]);
  const inputRef = useRef(null);
  const buttonRef = useRef(null);

  // Replaces the new recommendation with the new one
  const [unmountRecommendation, setUnmountRecommendation] = useState(false);

  // Options for the dropdown
  const options = ["Chat", "Voice"];

  // By deafult Chat is selected
  const [selectedOption, setSelectedOption] = useState(options[0]);

  // Get the user data from the redux store
  const { isAuth, uid, accessibility, city, preferred_fashion_style } =
    useSelector((state) => state.auth);

  const getImages = async () => {
    try {
      const uid = userData?.uid;
      const outfit_description = recommendation;

      const url = getImagesURL;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.accessToken}`,
        },
        body: JSON.stringify({ outfit_description }),
      });

      const imagesData = await response.json();

      if (imagesData?.image_urls?.length) {
        // Replace the recommendation with the images
        setRecommendation("");
        setImages(imagesData.image_urls);
      } else {
        setError("No images found. Please try again.");
      }
    } catch (error) {
      setError("Error in getting images. Please try again later.");
    }
  };

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const currentUser = await auth.currentUser();
        const {
          uid = undefined,
          email = undefined,
          accessToken = undefined,
        } = currentUser || {};

        // Navigate to the home page if the user is not logged in
        if (!uid || !email) {
          navigate("/");
        }

        const userChoices = await fireStore.getData({ uid });

        // User is new if no user choices, navigate to get-started page
        if (!userChoices) {
          navigate("/get-started", {
            state: { uid, email, accessToken, fromHome: true },
          });
        }

        const {
          city = undefined,
          accessibility = undefined,
          preferred_fashion_style = undefined,
        } = userChoices;

        // Set the data in the redux store
        dispatch(
          setUser({
            isAuth: true,
            uid,
            email,
            city,
            accessibility,
            preferred_fashion_style,
            accessToken,
          })
        );

        // Updating the page state
        setUserData({
          uid,
          email,
          city,
          accessibility,
          preferred_fashion_style,
          accessToken,
        });
      } catch (error) {
        setError("Something went wrong. Please try again later.");

        // Navigate to the home page in the case of error
        setTimeout(() => {
          navigate("/");
        }, 800);
      }
    };

    getCurrentUser();
  }, []);

  const getRecommendation = async (prompt) => {
    try {
      setImages([]);
      setLoading(true);

      if (!prompt.trim()) {
        setError("Please enter a prompt");
        return;
      }

      // Request body for the recommendation
      const requestBody = JSON.stringify({
        user_prompt: prompt.trim(),
        city: userData?.city,
        preferred_fashion_style: userData?.preferred_fashion_style,
        accessibility: userData?.accessibility,
      });

      const response = await fetch(recommendationUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userData?.accessToken}`,
        },
        body: requestBody,
      });

      const data = await response.json();

      if (!data?.response) {
        throw new Error("Something went wrong. Please try again later.");
      }

      // Replace the old recommendation with the new one
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

      // Focusing the input field
      setTimeout(() => {
        inputRef?.current?.focus();
      }, 0);
    }
  };

  // Send the prompt on the Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && prompt) {
      getRecommendation(prompt);
    }
  };

  return (
    <>
      <div className="bg-[#131314] h-full w-full text-[#eeeeee] flex flex-col justify-center items-center relative">
        <div className="flex w-full items-center justify-center px-3 py-2 lg:p-4 bg-[#eeeeee] shadow-lg shadow-gray-800/75 lg:pr-[2rem] ">
          <div className="flex justify-center items-center cursor-pointer mb-1 ">
            <ArrowBackIosIcon
              onClick={() => {
                navigate("/");
              }}
              className="text-gray-900 hover:text-gray-700 focus:outline-none"
              aria-label="Go back to the previous menu"
            />
          </div>
          <div className="flex-1 p-1 text-end">
            <Menu />
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
                  } transition-all duration-500 ease-in-out `}
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
              <div className="space-y-4 flex flex-col justify-center items-center w-full px-2  ">
                {[
                  "What should I wear to a summer wedding?",
                  "Give me an outfit idea for a first date.",
                  "How can I accessorize a little black dress?",
                ].map((samplePrompt, index) => (
                  <SamplePrompt
                    key={index}
                    samplePrompt={samplePrompt}
                    onClick={() => {
                      setPrompt(samplePrompt);
                      getRecommendation(samplePrompt);
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
                onChange={(e) => {
                  setPrompt(e.target.value);
                }}
                onKeyDown={handleKeyDown}
              />
              <button
                ref={buttonRef}
                className={`ml-2 absolute right-6 ${
                  !prompt || loading
                    ? "opacity-50 cursor-not-allowed"
                    : "opacity-100 cursor-pointer"
                } outline-blue-700`}
                onClick={() => getRecommendation(prompt)}
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
