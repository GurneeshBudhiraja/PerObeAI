import React from "react";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

function HeroPoints({ text, keypoints }) {
  return (
    <div className="py-2 tracking-wide">
      <div className="flex items-start space-x-2">
        <CheckCircleOutlineIcon className="text-[#4651B6] mt-0 md:mt-1" />
        <div className="text-base sm:text-nowrap md:text-lg font-semibold">
          {text}
        </div>
      </div>
      <div className="ml-8 hidden md:block mt-2 space-y-2 text-[#5E6878] ">
        {keypoints.map((point, index) => (
          <div key={index} className="text-base leading-relaxed">
            {point}
          </div>
        ))}
      </div>
    </div>
  );
}

export default HeroPoints;
