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
        if (command === "recommendCommand") {
          const refactor_user_prompt = `Generate a recommendation for ${user_prompt}`;

          // Log the refactored user prompt
          console.log("User prompt: ", refactor_user_prompt);

          const uid = userData?.uid;
          console.log("UID", uid);

          const url = `http://127.0.0.1:8000/api/web/v1/recommend?user_id=${uid}`;

          // Log the URL being requested
          console.log("MAKING REQUEST TO THE URL ", url);

          try {
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
              throw new Error(`Server responded with ${resp.status}`);
            }

            const data = await resp.json();

            console.log("Recommendation: ", data);

            if (data?.error) {
              alanInstance.playText(
                "Sorry, I am unable to process your request at the moment. Please try again later."
              );
            } else {
              alanInstance.playText(data?.response);
            }
          } catch (error) {
            console.error("Error fetching recommendation:", error);
            alanInstance.playText(
              "Sorry, there was a problem connecting to the server. Please try again later."
            );
          }
        }
      },
    });

    return () => {
      alanInstance.remove();
      alanInstance.deactivate();
    };
  }, [userData]);

  return (
    <div className="h-full " onClick={() => console.log("clicked")}>
      helo
    </div>
  );
}

export default VoiceChat;
