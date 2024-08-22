import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Dropdown } from "primereact/dropdown";

import { getImagesURL, recommendationUrl } from "../../utils/urlConstants.js";
import { setUser } from "../../store/authSlice/authSlice.js";

// Firebase services
import { auth, fireStore } from "../../firebase/firebaseServices.js";

// Custom components/pages/functions
import { VoiceChat } from "../pages.js";
import { InputText } from "primereact/inputtext";
import { SamplePrompt } from "../../components/components.js";

// Constants for the chat
import { samplePrompts } from "./chatConstants.js";

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
    <div className="bg-[#131314] h-full w-full text-[#eeeeee] flex flex-col justify-between items-center relative">
      <div className="flex flex-col w-full h-full justify-between py-5">
        {/* Dropdown */}
        <div>
          <Dropdown
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.value)}
            options={options}
            optionLabel="name"
            checkmark={true}
            className={`py-1 px-2 border-[1px] border-gray-600 rounded-lg shadow-lg ml-3 lg:ml-7 ${
              selectedOption === "Chat"
                ? "bg-gradient-to-tl from-[#ef6d9f]  to-[#eebfa2] text-black tracking-wider  "
                : "bg-gradient-to-br from-[#100D2B] via-[#302B61] to-[#242440] text-white tracking-widest "
            } transition-all duration-300 ease-in-out`}
            panelClassName={`border-[1px] border-gray-600 rounded-lg shadow-lg mt-1 pl-3 pb-2 z-50 tracking-wider  ${
              selectedOption === "Chat"
                ? "bg-gradient-to-tl from-[#ef6d9f]  to-[#eebfa2] text-black tracking-wider  "
                : "bg-gradient-to-br from-[#100D2B] via-[#302B61] to-[#242440] text-white "
            }   transition-color duration-300 ease-in-out`}
          />
        </div>
        {selectedOption === "Chat" && (
          // Sample prompts
          <div
            className={`w-full ${
              recommendation ? "hidden" : "flex"
            } justify-center items-center px-12 `}
          >
            <div className="grid grid-cols-2 grid-rows-2 grid-flow-col mx-auto md:grid-cols-4 md:grid-flow-row md:grid-rows-1 gap-8 rounded-lg  ">
              {samplePrompts.map((samplePrompt, index) => (
                <SamplePrompt
                  key={index}
                  index={index}
                  samplePrompt={samplePrompt.prompt}
                  onClick={() => {
                    setPrompt(samplePrompt.prompt);
                    getRecommendation(samplePrompt.prompt);
                  }}
                  className={samplePrompt.style}
                />
              ))}
            </div>
          </div>
        )}

        {selectedOption === "Voice" ? (
          <VoiceChat />
        ) : (
          // Input field for the chat
          <div className="w-full flex justify-center items-center my-4 md:my-6">
            <div
              className={`w-4/5 md:w-3/4 lg:w-2/4 h-[3rem] flex items-center justify-center ${
                loading ? "cursor-not-allowed" : "cursor-auto"
              }`}
            >
              <InputText
                ref={inputRef}
                disabled={loading}
                autoFocus
                placeholder="Need outfit advice? Ask here..."
                className="outline-none w-full bg-[#212121] border-[0.75px] border-gray-200 rounded-full p-4 px-5 focus:bg-[#343333c0] transition-all duration-100 ease-in-out tracking-wide poppins-regular hover:bg-[#3433338f] flex-grow pr-16  focus:border-[1px] "
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
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Chat;
