import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { Input } from "@material-tailwind/react";
import { FloatLabel } from "primereact/floatlabel";
import { Button } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { Snackbar, Alert } from "@mui/material";

function AccountSettings() {
  const navigate = useNavigate();
  const authData = useSelector((state) => state.auth);
  const [success, setSuccess] = useState(false);

  const [userData, setUserData] = useState({
    city: "",
    accessibility: "",
    preferred_fashion_style: "",
  });

  // Accessibility options
  const accessibilities = [
    { accessibility: "None" },
    { accessibility: "Blind" },
    { accessibility: "Color Blind" },
  ];

  // Color blindness types
  const colorBlindnessType = [
    { colorBlindnessType: "Deuteranopia" },
    { colorBlindnessType: "Protanopia" },
    { colorBlindnessType: "Tritanopia" },
    { colorBlindnessType: "Tritanomaly" },
    { colorBlindnessType: "Deuteranomaly" },
    { colorBlindnessType: "Cone Monochromacy" },
    { colorBlindnessType: "Rod Monochromacy" },
  ];
  const updateData = () => {
    try {
      const { uid } = authData;
      console.log(uid);
      console.log(userData);
      if (
        !userData.city ||
        !userData.accessibility ||
        !userData.preferred_fashion_style
      ) {
        console.log("Please fill all the fields");
        return;
      }
      setSuccess(true);
    } catch (error) {
      // TODO: will remove this after error handling
      console.log(error);
    } finally {
      setUserData({
        city: "",
        accessibility: "",
        preferred_fashion_style: "",
      });
    }
  };
  useEffect(() => {
    if (!authData.uid) return navigate("/");
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 px-4 md:px-8">
      <div className="flex items-center mb-8">
        <button
          onClick={() => navigate(-1)}
          className="text-gray-600 hover:text-gray-900 focus:outline-none"
          aria-label="Go back to the previous menu"
        >
          <img
            src="../../../assets/arrow_back.svg"
            alt="Go back"
            className="h-6 w-6"
          />
        </button>
        <p className="ml-4 text-3xl font-semibold text-gray-800">
          Account Settings
        </p>
      </div>
      <div className="space-y-8">
        <div>
          <Input
            id="city"
            label="City"
            value={userData?.city}
            onChange={(e) => {
              setUserData({ ...userData, city: e.target.value });
            }}
            className="w-full bg-white p-3 rounded-lg border border-gray-300 "
            placeholder="Enter your city"
          />
        </div>
        <div>
          <label
            htmlFor="accessibility"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Accessibility
          </label>
          <Dropdown
            id="accessibility"
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
            placeholder="Select Accessibility Option"
            className="w-full bg-white p-3 rounded-lg border border-gray-300"
            panelClassName="bg-white"
          />
          {userData.accessibility.accessibility === "Color Blind" && (
            <div className="mt-4">
              <label
                htmlFor="colorBlindnessType"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Color Blindness Type
              </label>
              <Dropdown
                id="colorBlindnessType"
                value={userData?.colorBlindnessType}
                onChange={(e) =>
                  setUserData({ ...userData, colorBlindnessType: e.value })
                }
                options={colorBlindnessType}
                optionLabel="colorBlindnessType"
                checkmark={true}
                placeholder="Select Color Blindness Type"
                className="w-full bg-white p-3 rounded-lg border border-gray-300"
                panelClassName="bg-white"
              />
            </div>
          )}
        </div>
        <div>
          <FloatLabel>
            <Input
              id="preferred_fashion_style"
              label="Preferred Fashion Style"
              className="w-full bg-white h-fit p-3 rounded-lg border border-gray-300"
              value={userData?.preferred_fashion_style}
              onChange={(e) =>
                setUserData({
                  ...userData,
                  preferred_fashion_style: e.target.value,
                })
              }
              placeholder="Enter your preferred fashion style"
            />
          </FloatLabel>
        </div>
      </div>
      <div className="mt-8">
        <Button
          color="blue"
          className="w-full md:w-auto py-3 px-6 rounded-lg shadow-lg"
          onClick={updateData}
        >
          Save Settings
        </Button>
      </div>
      {success && (
        <Snackbar
          open={!!success}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={1100}
          onClose={() => setSuccess(false)}
        >
          <Alert
            onClose={() => setSuccess(false)}
            severity="success"
            sx={{ width: "100%" }}
          >
            {"You have been logged out successfully"}
          </Alert>
        </Snackbar>
      )}
    </div>
  );
}

export default AccountSettings;
