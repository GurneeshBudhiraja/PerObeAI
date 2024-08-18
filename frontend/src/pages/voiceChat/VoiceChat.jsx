import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

import { recommendationUrl } from "../../utils/urlConstants.js";
import keys from "../../keys/keys.js";

// Alan button from the sdk
import alanBtn from "@alan-ai/alan-sdk-web";

function VoiceChat() {
  const userData = useSelector((state) => state.auth);
  const [recommendation, setRecommendation] = useState("");

  // Replace the new recommendation with the old one
  const [unmountRecommendation, setUnmountRecommendation] = useState(false);

  useEffect(() => {
    const alanInstance = alanBtn({
      key: keys.alanKey,
      onCommand: async ({ command, user_prompt }) => {
        try {
          if (command === "recommendCommand") {
            // Custom prefix to the user prompt for better recommendations
            const refactor_user_prompt = `Generate a recommendation for ${user_prompt}`;

            alanInstance.playText("Wait a moment while I am thinking...");

            const url = recommendationUrl;

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

            // Remove the old recommendation and add the new one
            setUnmountRecommendation(true);

            if (data?.error) {
              alanInstance.playText(
                "Sorry, I am unable to process your request at the moment. Please try again later."
              );
            } else {
              setTimeout(() => {
                setRecommendation(data?.response);
                setUnmountRecommendation(false);
              }, 450);
              alanInstance.playText(
                data?.response || "Sorry, I didn't understand the response."
              );
            }
          }
        } catch (error) {
          alanInstance.playText(
            "Sorry, I am unable to process your request at the moment. Please try again later."
          );
        }
      },
    });

    return () => {
      alanInstance.remove();
      alanInstance.deactivate();
    };
  }, [userData]);

  return (
    <div className="h-full flex flex-col items-center justify-center">
      {!recommendation && (
        <div className="flex flex-col text-center p-2 border-2 border-[#6b3c83af] rounded-lg mx-2 gap-2 text-[1rem] tracking-wider lg:text-lg select-none bg-gradient-to-br from-transparent via-[#5e2ed8b4] to-[#4b50e8ae] ">
          Press the mic and say a command like:
          <span>&apos;Recommend something for the party tonight.&apos;</span>
        </div>
      )}
      {recommendation && (
        <div
          className={`h-full flex flex-col justify-center items-center transition-all duration-500 ease-in-out max-w-prose ${
            !unmountRecommendation ? "opacity-100" : "opacity-0"
          } `}
        >
          <p className="text-[#eeeeee] animate-slide-in-bottom flex flex-col items-start gap-5 px-8 ">
            {recommendation}
          </p>
        </div>
      )}
    </div>
  );
}

export default VoiceChat;
