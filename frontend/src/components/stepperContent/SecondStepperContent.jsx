import { Dropdown } from "primereact/dropdown";
import { Input } from "@material-tailwind/react";
import { FloatLabel } from "primereact/floatlabel";
import {
  accessibilities,
  colorBlindnessType,
} from "../../pages/accountSettings/accountSettingsConstants.js";

function SecondStepperContent({ canProceed, userData, setUserData }) {
  return (
    <div>
      {/* City input */}
      <Input
        label="City"
        value={userData?.city}
        onChange={(e) => {
          setUserData({ ...userData, city: e.target.value });
        }}
        className="bg-gray-200 p-3"
        placeholder="City"
      />

      {/* Accessibility dropdown */}
      <div className="my-8 flex flex-col sm:flex-row justify-between  gap-2 w-full h-full ">
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
          className="w-full sm:w-1/2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out text-gray-700 p-2 "
          panelClassName="bg-white border border-black rounded-lg shadow-lg"
        />

        {userData.accessibility?.accessibility === "Color Blind" && (
          <Dropdown
            value={userData?.colorBlindnessType}
            onChange={(e) =>
              setUserData({ ...userData, colorBlindnessType: e.value })
            }
            options={colorBlindnessType}
            optionLabel="colorBlindnessType"
            checkmark={true}
            placeholder="Type"
            className="w-full sm:w-1/2 bg-gray-50 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-200 ease-in-out text-gray-700 p-2 "
            panelClassName="bg-white border border-black rounded-lg shadow-lg"
          />
        )}
      </div>

      {/* Preferred fashion style input */}
      <div className="w-full">
        <FloatLabel>
          <Input
            label="Preferred Fashion Style"
            className="w-full"
            id="description"
            value={userData?.preferred_fashion_style}
            onChange={(e) =>
              setUserData({
                ...userData,
                preferred_fashion_style: e.target.value,
              })
            }
            rows={5}
            cols={30}
          />
        </FloatLabel>
      </div>
    </div>
  );
}

export default SecondStepperContent;
