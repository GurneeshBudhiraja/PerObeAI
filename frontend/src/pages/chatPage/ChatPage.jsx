import { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

// Firebase services
import { auth, fireStore } from "../../firebase/firebaseServices.js";

// Store action
import { setUser } from "../../store/authSlice/authSlice.js";

// Utility functions
import { getRecommendation, getImages } from "./chatUtils.js";

// Options for the dropdown
const OPTIONS = ["Chat", "Voice"];

// Icons and components
import SendIcon from "@mui/icons-material/Send";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { SamplePrompt } from "../../components/components.js";

// Voice chat page
import VoiceChat from "./VoiceChat.jsx";

// Chat constants
import { samplePrompts } from "./chatConstants.js";

function ChatPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const inputRef = useRef(null);
  const buttonRef = useRef(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [prompt, setPrompt] = useState("");
  const [images, setImages] = useState([]);

  const [userData, setUserData] = useState({});
  const [recommendation, setRecommendation] = useState({
    is_valid: true,
    response: "",
  });

  // Replaces the old recommendation with a new one
  const [unmountRecommendation, setUnmountRecommendation] = useState(false);

  // By deafult Chat is selected
  const [selectedOption, setSelectedOption] = useState(OPTIONS[0]);

  // User data from the redux store
  const storeData = useSelector((state) => state.auth);

  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        // Check if the user is authenticated
        if (storeData.isAuth) {
          // Updating the user data state
          setUserData({
            uid: storeData?.uid,
            email: storeData?.email,
            city: storeData?.city,
            accessibility: storeData?.accessibility,
            preferred_fashion_style: storeData?.preferred_fashion_style,
            accessToken: storeData?.accessToken,
          });
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
  }, [dispatch, navigate, storeData]);

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
    <div className="py-3 bg-[#131314] h-screen w-full text-[#eeeeee] flex flex-col justify-between items-center relative overflow-scroll ">
      <div className="flex flex-col w-full h-full justify-between py-5">
        {/* Dropdown */}
        <div>
          <Dropdown
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.value)}
            options={OPTIONS}
            optionLabel="name"
            checkmark={true}
            className={`py-1 px-2 border-[1px] border-gray-600 rounded-lg shadow-lg ml-3 mb-3 lg:ml-7 text-black tracking-wider bg-gradient-to-tl from-[#C9D6FF] to-[#E2E2E2] transition-all duration-300 ease-in-out`}
            panelClassName={`border-[1px] border-gray-600 rounded-lg shadow-lg mt-1 pl-3 pb-2 z-50 tracking-wider bg-gradient-to-tl from-[#C9D6FF] to-[#E2E2E2] transition-color duration-300 ease-in-out`}
          />
        </div>

        {/* Sample prompts to show at the very start */}
        {selectedOption === "Chat" && (
          <div
            className={`${
              !recommendation.response ? "w-full" : "mx-auto md:max-w-2xl"
            } flex justify-center items-center`}
          >
            {!recommendation.response && !images.length ? (
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
              <div className="flex flex-col  items-start px-5 mb-5  ">
                <div
                  className={`max-h-64 leading-relaxed text-[0.90rem] md:text-base overflow-y-scroll p-3 mb-2 bg-gradient-to-br from-[#BE93C5]  to-[#7BC6CC] text-black selection:bg-[#CDD8F9] tracking-wide font-normal ${
                    !unmountRecommendation ? "opacity-100" : "opacity-0"
                  } transition-all duration-300 ease-in-out border-2 rounded-lg shadow-lg shadow-white/25 `}
                >
                  <div>{recommendation.response}</div>
                </div>
                <div
                  className={`w-full flex justify-center items-center mt-1 ${
                    !unmountRecommendation ? "opacity-100" : "opacity-0"
                  } transition-all duration-300 ease-in-out `}
                >
                  {!!images.length && (
                    <div className="w-auto h-auto overflow-x-scroll whitespace-nowrap snap-x snap-mandatory md:overflow-x-visible md:w-full md:h-auto md:flex md:justify-evenly md:items-center space-x-3  overflow-y-hidden bg-gradient-to-tl from-[#BE93C5]  to-[#7BC6CC] shadow-lg shadow-white/25 py-2 border-2 rounded-lg border-white">
                      {images.map((image, index) => (
                        <img
                          key={index}
                          src={image.url}
                          loading="lazy"
                          alt="outfit"
                          className="inline-block rounded-3xl object-contain p-2 w-64 h-64 snap-center snap-always md:w-1/3 md:h-auto "
                        />
                      ))}
                    </div>
                  )}
                </div>

                {recommendation.is_valid && !images.length && (
                  <div className="w-full flex justify-center items-center mt-3 ">
                    <button
                      className="w-fit bg-gradient-to-br from-[#C9D6FF]  to-[#E2E2E2] text-black tracking-wide text-sm lg:text-base p-2 shadow-get-images-button md:hover:shadow-get-images-button-hover md:hover:-translate-x-1 md:hover:-translate-y-1 transition-all duration-300 ease-in-out rounded-2xl xs:active:translate-x-1 xs:active:translate-y-1 xs:active:shadow-none "
                      onClick={() =>
                        getImages({
                          setError,
                          recommendation: recommendation?.response,
                          setLoading,
                          accessToken: userData?.accessToken,
                          setImages,
                          inputRef,
                        })
                      }
                    >
                      View Outfit Images
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {selectedOption === "Voice" ? (
          <VoiceChat />
        ) : (
          // Chat
          <div className="w-full flex justify-center items-center ">
            {/* Input field for the chat */}
            <div
              className={`w-4/5 md:w-3/4 lg:w-2/4 h-[3rem] my-9 md:my-5 lg:my-0 flex items-center justify-center ${
                loading ? "cursor-not-allowed" : "cursor-auto"
              }`}
            >
              <InputText
                ref={inputRef}
                disabled={loading}
                autoFocus
                placeholder="Need outfit advice? Ask here..."
                className="outline-none w-full bg-[#212121] border-[0.75px] border-gray-200 rounded-full p-4 px-5 focus:bg-[#343333ce] transition-all duration-100 ease-in-out tracking-wide poppins-regular hover:bg-[#3433338f] flex-grow pr-16 focus:border-[1px] "
                value={prompt}
                onChange={(e) => {
                  setPrompt(e.target.value);
                }}
                onKeyDown={handleKeyDown}
              />
              {/* Submit button */}
              <button
                ref={buttonRef}
                className={`ml-2 absolute right-6 flex justify-center items-center ${
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
                  <CircularProgress size={30} style={{ color: "#CCD7FA" }} />
                )}
              </button>

              {/* Error alert */}
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

export default ChatPage;
