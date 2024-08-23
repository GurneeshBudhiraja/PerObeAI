import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Dropdown } from "primereact/dropdown";

import { getRecommendation } from "./chatUtils.js";
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
  // TODO: will change to empty string after testing and styling
  const [recommendation, setRecommendation] = useState({
    is_valid: false,
    response: "",
  });
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

  // Get the authentication status from the redux store
  const { isAuth } = useSelector((state) => state.auth);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        // Return if the user is already authenticated
        if (isAuth) {
          return;
        }

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
  }, [dispatch, isAuth, navigate]);

  // Send the prompt on the Enter key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && prompt) {
      getRecommendation(
        prompt,
        setImages,
        setError,
        setLoading,
        userData?.city,
        userData?.preferred_fashion_style,
        userData?.accessibility,
        inputRef,
        userData?.accessToken,
        setRecommendation,
        setPrompt,
        setUnmountRecommendation
      );
    }
  };

  return (
    <div className="py-3 bg-[#131314] h-screen w-full text-[#eeeeee] flex flex-col justify-between items-center relative overflow-scroll">
      <div className="flex flex-col w-full h-full justify-between py-5">
        {/* Dropdown */}
        <div>
          <Dropdown
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.value)}
            options={options}
            optionLabel="name"
            checkmark={true}
            className={`py-1 px-2 border-[1px] border-gray-600 rounded-lg shadow-lg ml-3 mb-3 lg:ml-7 ${
              selectedOption === "Chat"
                ? "bg-gradient-to-br from-[#C9D6FF]  to-[#E2E2E2] text-black tracking-wider  "
                : "bg-gradient-to-br from-[#100D2B] via-[#302B61] to-[#242440] text-white tracking-widest "
            } transition-all duration-300 ease-in-out`}
            panelClassName={`border-[1px] border-gray-600 rounded-lg shadow-lg mt-1 pl-3 pb-2 z-50 tracking-wider  ${
              selectedOption === "Chat"
                ? "bg-gradient-to-br from-[#C9D6FF]  to-[#E2E2E2] text-black tracking-wider  "
                : "bg-gradient-to-br from-[#100D2B] via-[#302B61] to-[#242440] text-white "
            }   transition-color duration-300 ease-in-out`}
          />
        </div>
        {selectedOption === "Chat" && (
          // Sample prompts
          <div
            className={`${
              !recommendation.response ? "w-full" : "mx-auto md:max-w-2xl"
            } flex justify-center items-center`}
          >
            {!recommendation.response ? (
              <div
                className={`grid grid-cols-2 grid-rows-2 grid-flow-col mx-auto md:grid-cols-4 md:grid-flow-row md:grid-rows-1 gap-8 rounded-lg ${
                  !unmountRecommendation ? "opacity-100" : "opacity-0"
                } transition-all duration-200 ease-in-out `}
              >
                {samplePrompts.map((samplePrompt, index) => (
                  <SamplePrompt
                    key={index}
                    index={index}
                    loading={loading}
                    samplePrompt={samplePrompt.prompt}
                    onClick={() => {
                      setPrompt(samplePrompt.prompt);
                      getRecommendation(
                        samplePrompt.prompt,
                        setImages,
                        setError,
                        setLoading,
                        userData?.city,
                        userData?.preferred_fashion_style,
                        userData?.accessibility,
                        inputRef,
                        userData?.accessToken,
                        setRecommendation,
                        setPrompt,
                        setUnmountRecommendation
                      );
                    }}
                    className={samplePrompt.style}
                  />
                ))}
              </div>
            ) : (
              <div className="flex flex-col  items-start p-3 ">
                <div
                  className={`max-h-64 leading-relaxed text-[0.90rem] md:text-base overflow-y-scroll p-3 mb-2 bg-gradient-to-tl from-[#3a6186] to-[#89253e] text-gray-300 selection:bg-black/75 tracking-wide font-normal border-2 border-gray-100 rounded-lg ${
                    !unmountRecommendation ? "opacity-100" : "opacity-0"
                  } transition-all duration-300 ease-in-out `}
                >
                  {recommendation.response}
                </div>
              </div>
            )}
          </div>
        )}

        {selectedOption === "Voice" ? (
          <VoiceChat />
        ) : (
          // Input field for the chat
          <div className="w-full flex justify-center items-center  md:my-6">
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
                onClick={() =>
                  getRecommendation(
                    prompt,
                    setImages,
                    setError,
                    setLoading,
                    userData?.city,
                    userData?.preferred_fashion_style,
                    userData?.accessibility,
                    inputRef,
                    userData?.accessToken,
                    setRecommendation,
                    setPrompt,
                    setUnmountRecommendation
                  )
                }
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
