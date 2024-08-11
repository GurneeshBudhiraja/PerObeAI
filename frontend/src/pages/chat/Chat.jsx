import React, { useEffect, useState, useRef } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Link, useLocation } from "react-router-dom";

// components and icons
import { InputText } from "primereact/inputtext";
import SendIcon from "@mui/icons-material/Send";
import { SamplePrompt } from "../../components/components";
import CircularProgress from "@mui/material/CircularProgress";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";

function Chat() {
  const location = useLocation();
  const [unmountRecommendation, setUnmountRecommendation] = useState(false);
  const [loading, setLoading] = useState(false);
  const userData = useSelector((state) => state.auth);
  const [recommendation, setRecommendation] = useState("");
  const [error, setError] = useState("");
  const [prompt, setPrompt] = useState("");
  const inputRef = useRef(null);
  useEffect(() => {
    if (!location?.state?.fromHomePage || !userData?.isAuth) {
      // navigate("/");
    }
  }, []);

  const getRecommendation = async () => {
    try {
      setLoading(true);

      if (!prompt.trim()) {
        console.log("Please enter a prompt");
        setError("Please enter a prompt");
        return;
      }
      const requestBody = JSON.stringify({
        user_prompt: prompt.trim(),
        city: userData?.city,
        preferred_fashion_style: userData?.preferred_fashion_style,
        accessibility: userData?.accessibility,
      });

      // TODO: Will move this url to a config file  and will also change the url
      const uid = "JKVDl1ErPjaj3TPRNuBUsN3W9xS2";
      const url = `http://127.0.0.1:8000/api/web/v1/recommend?user_id=${uid}`;

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: requestBody,
      });
      const data = await response.json();
      if (!data?.response) {
        throw new Error("Something went wrong. Please try again later ");
      }

      if (!data?.response) {
        throw new Error("Something went wrong. Please try again later ");
      }

      setUnmountRecommendation(true);

      setTimeout(() => {
        setRecommendation(data?.response);
        setUnmountRecommendation(false);
      }, 450);
    } catch (error) {
      // TODO: will remove after error handling is done
      console.log(error);
      setError(error.message);
    } finally {
      setLoading(false);
      setPrompt("");
      setTimeout(() => {
        inputRef?.current?.focus();
      }, 0);
    }
  };

  // handle enter key press input
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && prompt) {
      getRecommendation();
    }
  };
  return (
    <>
      <div
        className={
          "bg-[#131314] h-full w-full text-[#eeeeee] flex flex-col justify-center items-center "
        }
      >
        <div
          className={
            "h-full flex justify-center items-center transition-all duration-300 ease-out max-w-prose"
          }
        >
          {recommendation && (
            <div
              className={`text-[#eeeeee] animate-slide-in-bottom flex flex-col items-start gap-5 ${
                !unmountRecommendation ? "opacity-100" : "opacity-0"
              } transition-all duration-500 ease-in-out`}
            >
              {recommendation}
              <button 
              className="bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 text-white font-semibold py-2 px-6 rounded-full shadow-lg transition-all duration-200 ease-in-out hover:opacity-85 active:opacity-80"
              onClick={() => {console.log("GET PICTURES")}}
              >
                {/* TODO: will complete once the route is ready in the backend */}
                Get Pictures of the recommended outfit
              </button>
            </div>
          )}
          {error && (
            <Snackbar
              open={error}
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
        {/* input bar */}
        <div
          className={`w-2/4 h-[3rem] flex items-center justify-center fixed bottom-10 left-1/2 -translate-x-1/2 ${
            loading ? "cursor-not-allowed" : "cursor-auto"
          } `}
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
            className={`ml-2 absolute right-6 ${
              !prompt || loading
                ? "opacity-50 cursor-not-allowed"
                : "opacity-100 cursor-pointer"
            } outline-blue-700 `}
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
    </>
  );
}

export default Chat;
