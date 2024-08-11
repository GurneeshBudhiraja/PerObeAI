import React, { useEffect, useState } from "react";
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
          
          // will remove this after testing 
          console.log("User prompt: ", refactor_user_prompt);
          // will change the URL to the actual URL
          alanInstance.playText("Wait a moment while I am thinking...");
          
          const url =
            "http://127.0.0.1:8000/api/web/v1/recommend?user_id=JKVDl1ErPjaj3TPRNuBUsN3W9xS2";
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

          const data = await resp.json();
          // TODO: will remove after testing
          console.log("Recommendation: ", data);
          if (data?.error) {
            alanInstance.playText(
              "Sorry, I am unable to process your request at the moment. Please try again later."
            );
          } else {
            alanInstance.playText(data?.response);
          }
        }
      },
    });
    alanInstance.deactivate();

    return () => {
      alanInstance.remove();
      alanInstance.deactivate();
    };
  }, [userData]);
  

  return (
    <div
      className="h-full "
      onClick={() => console.log("clicked")}
    >
      helo
    </div>
  );
}

export default VoiceChat;
