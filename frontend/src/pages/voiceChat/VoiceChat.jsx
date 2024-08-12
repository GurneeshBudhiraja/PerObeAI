import React, { useEffect } from "react";
import alanBtn from "@alan-ai/alan-sdk-web";
import keys from "../../keys/keys.js";
import { useSelector } from "react-redux";

function VoiceChat() {
  const userData = useSelector((state) => state.auth);

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
            console.log("Recommendation: ", data);

            if (data?.error) {
              alanInstance.playText(
                "Sorry, I am unable to process your request at the moment. Please try again later."
              );
            } else {
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
  }, []);

  return (
    <div className="h-full " onClick={() => console.log("clicked")}>
      helo
    </div>
  );
}

export default VoiceChat;
