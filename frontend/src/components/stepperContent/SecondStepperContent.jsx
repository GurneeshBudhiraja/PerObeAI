/* eslint-disable react/prop-types */
import React, { useState, useEffect } from "react";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { FloatLabel } from "primereact/floatlabel";

function SecondStepperContent({ canProceed, userData ,setUserData }) {

  const accessibilities = [
    { accessibility: "None" },
    { accessibility: "Blind" },
    { accessibility: "Color Blind" },
  ];
  const colorBlindnessType = [
    { colorBlindnessType: "Deuteranopia" },
    { colorBlindnessType: "Protanopia" },
    { colorBlindnessType: "Tritanopia" },
    { colorBlindnessType: "Tritanomaly" },
    { colorBlindnessType: "Deuteranomaly" },
    { colorBlindnessType: "Cone Monochromacy" },
    { colorBlindnessType: "Rod Monochromacy" },
  ];

  
  return (
    <div>
      <InputText
        value={userData?.city}
        onChange={(e) => {
          setUserData({ ...userData, city: e.target.value });
        }}
        className="bg-gray-200"
        placeholder="City"
      />
      <div className="card flex justify-content-center">
        {/* TODO: will make a separate component of this dropdown */}
        <Dropdown
          value={userData?.accessibility}
          onChange={(e) =>
            setUserData({
              ...userData,
              accessibility: e.value,
              colorBlindnessType: null,
            })
          }
          options={accessibilities}
          optionLabel="accessibility"
          checkmark={true}
          placeholder="Accessibility"
          className="w-full md:w-14rem"
        />
      </div>
      {userData.accessibility?.accessibility === "Color Blind" && (
        <Dropdown
          value={userData?.colorBlindnessType}
          onChange={(e) =>
            setUserData({ ...userData, colorBlindnessType: e.value })
          }
          options={colorBlindnessType}
          optionLabel="colorBlindnessType"
          checkmark={true}
          placeholder="Color Blindness Type"
          className="w-full md:w-14rem"
        />
      )}
      <div className="card flex justify-content-center">
        <FloatLabel>
          <InputTextarea
            id="description"
            value={userData?.preferred_fashion_style}
            onChange={(e) => setUserData({ ...userData, preferred_fashion_style: e.target.value })}
            rows={5}
            cols={30}
          />
          <label htmlFor="description">Description</label>
        </FloatLabel>
      </div>
    </div>
  );
}

export default SecondStepperContent;
