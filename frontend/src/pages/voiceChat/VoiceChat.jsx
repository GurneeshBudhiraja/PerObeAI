import React, { useEffect, useState } from "react";
import alanBtn from "@alan-ai/alan-sdk-web";
import keys from "../../keys/keys.js";
import { useSelector } from "react-redux";

function VoiceChat() {
  const userData = useSelector((state) => state.auth);
  const [recommendation, setRecommendation] = useState("");
  const [unmountRecommendation, setUnmountRecommendation] = useState(false);

  useEffect(() => {
    const alanInstance = alanBtn({
      key: keys.alanKey,
      onCommand: async ({ command, user_prompt }) => {
        try {
          if (command === "recommendCommand") {
            const refactor_user_prompt = `Generate a recommendation for ${user_prompt}`;
            console.log("User prompt: ", refactor_user_prompt);


            alanInstance.playText("Wait a moment while I am thinking...");

            const uid = userData?.uid;

            const url = `https://perobeai-bhgx.onrender.com/api/web/v1/recommend?user_id=${uid}`;
            console.log("MAKING REQUEST TO URL: ", url);

            const resp = await fetch(url, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
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
            
            // TODO: will remove after testing
            console.log("Recommendation: ", data);
            setUnmountRecommendation(true);
            if (data?.error) {
              alanInstance.playText(
                "Sorry, I am unable to process your request at the moment. Please try again later."
              );
            } else {
              setTimeout(()=>{
                setRecommendation(data?.response);
                setUnmountRecommendation(false);
              },450);
              alanInstance.playText(
                data?.response || "Sorry, I didn't understand the response."
              );
            }
          }
        } catch (error) {
          console.log("Error in processing the command", error.message);
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
      {recommendation && (
        <div className={`h-full flex flex-col justify-center items-center transition-all duration-500 ease-in-out max-w-prose ${!unmountRecommendation?"opacity-100":"opacity-0"} `}>
          <p className="text-[#eeeeee] animate-slide-in-bottom flex flex-col items-start gap-5 px-8 ">{recommendation}</p>
        </div>
      )}
    </div>
  );
}

export default VoiceChat;
