import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

// URL constants
import { getRecommendationUrl } from "../../utils/urlConstants.js";

import keys from "../../keys/keys.js";

// Alan button from the sdk
import alanBtn from "@alan-ai/alan-sdk-web";

function VoiceChat() {
  // User data from the store
  const userData = useSelector((state) => state.auth);

  const [recommendation, setRecommendation] = useState("");
  const [loading, setLoading] = useState(true);

  // Replace the old recommendation with a new one
  const [unmountRecommendation, setUnmountRecommendation] = useState(false);

  useEffect(() => {
    const alanInstance = alanBtn(
      {
        key: keys.alanKey,
        onCommand: async ({ command, user_prompt }) => {
          try {
            if (command === "recommendCommand") {
              // Custom prefix to the user prompt for generating proper recommendations from Gemini AI
              const refactor_user_prompt = `Generate a recommendation for ${user_prompt}`;

              alanInstance.playText("Wait a moment while I am thinking...");

              const url = getRecommendationUrl;

              const resp = await fetch(url, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${userData?.accessToken}`,
                },
                body: JSON.stringify({
                  user_prompt: refactor_user_prompt,
                  city: userData?.city,
                  preferred_fashion_style: userData?.preferred_fashion_style,
                  accessibility: userData?.accessibility,
                }),
              });

              if (!resp.ok) {
                throw new Error("Failed to fetch recommendation");
              }

              const data = await resp.json();

              // Unmount the old recommendation
              setUnmountRecommendation(true);

              // Checking for the error
              if (data?.error) {
                alanInstance.playText(
                  "Sorry, I am unable to process your request at the moment. Please try again later."
                );
              } else {
                alanInstance.playText(
                  data?.response || "Sorry, I didn't understand the response."
                );
                setTimeout(() => {
                  setRecommendation(data?.response);
                  setUnmountRecommendation(false);
                }, 450);
              }
            }
          } catch (error) {
            alanInstance.playText(
              "Sorry, I am unable to process your request at the moment. Please try again later."
            );
          }
        },
      },
      [
        userData.accessToken,
        userData.city,
        userData.preferred_fashion_style,
        userData.accessibility,
      ]
    );

    setLoading(false);

    return () => {
      alanInstance.remove();
      alanInstance.deactivate();
    };
  }, [
    userData.accessToken,
    userData.city,
    userData.preferred_fashion_style,
    userData.accessibility,
  ]);

  return (
    <div className="h-full flex flex-col items-center justify-center ">
      {!recommendation && (
        <div
          className={`flex flex-col text-center p-2  border-2 text-black border-white rounded-lg mx-5 gap-2 text-[1rem] tracking-wide lg:text-[1.1rem] select-none bg-gradient-to-tl from-[#BE93C5] to-[#7BC6CC]  ${
            loading ? "opacity-0 scale-90" : "opacity-100 scale-100   "
          } duration-300 ease-linear transition-all `}
        >
          Press the mic and say a command like:
          <span>&apos;Recommend something for the party tonight.&apos;</span>
        </div>
      )}
      {recommendation && (
        <div
          className={` flex flex-col justify-center items-center transition-all duration-500 ease-in-out max-w-prose px-3 mb-7  ${
            !unmountRecommendation ? "opacity-100" : "opacity-0"
          } `}
        >
          <p className="text-black animate-slide-in-bottom flex flex-col items-start gap-5 px-8 py-2 bg-gradient-to-tl from-[#BE93C5] to-[#7BC6CC] leading-relaxed max-h-64 overflow-scroll rounded-lg shadow shadow-white">
            {recommendation}
          </p>
        </div>
      )}
    </div>
  );
}

export default VoiceChat;
