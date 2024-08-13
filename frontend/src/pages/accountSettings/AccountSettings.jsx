import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dropdown } from "primereact/dropdown";
import { Input } from "@material-tailwind/react";
import { FloatLabel } from "primereact/floatlabel";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@material-tailwind/react";
import { useDispatch, useSelector } from "react-redux";
import { Snackbar, Alert, getStepUtilityClass } from "@mui/material";
import { fireStore, auth } from "../../firebase/firebaseServices.js";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { setUser } from "../../store/authSlice/authSlice.js";
import { titleCase } from "./accountSettingsUtils/accountSettingsUtils.js";

function AccountSettings() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const [success, setSuccess] = useState(false);
  const [userData, setUserData] = useState({
    uid: "",
    email: "",
    city: "",
    accessibility: "",
    preferred_fashion_style: "",
  });
  const storeUserData = useSelector((state) => state.auth);
  const [error, setError] = useState(false);

  useEffect(() => {
    setError(false);
    const getUserData = async () => {
      try {
        const storeData = {
          uid: storeUserData?.uid,
          email: storeUserData?.email,
        };

        if (!storeData?.uid || !storeData?.email) {
          const currentUser = await auth.currentUser();
          const uid = currentUser?.uid;
          const email = currentUser?.email;
          if (!uid) {
            return navigate("/");
          }
          setUserData({ ...userData, uid, email });
          storeData.uid = uid;
          storeData.email = email;
        } else {
          setUserData({
            ...userData,
            uid: storeData?.uid,
            email: storeData?.email,
          });
        }
        const userChoices = await fireStore.getData({ uid: storeData?.uid });
        const { city, accessibility, preferred_fashion_style } = userChoices;

        if (accessibility === "Blind" || accessibility === "None") {
          setUserData((prev) => ({
            ...prev,
            city,
            accessibility: { accessibility },
            preferred_fashion_style,
          }));
        } else {
          setUserData((prev) => ({
            ...prev,
            city,
            accessibility: { accessibility: "Color Blind" },
            colorBlindnessType: { colorBlindnessType: accessibility },
            preferred_fashion_style,
          }));
        }
        dispatch(
          setUser({
            city,
            preferred_fashion_style,
            accessibility,
            uid: storeData?.uid,
            email: storeData?.email,
            isAuth: true,
          })
        );
      } catch (error) {
        setError(true);
        console.log("Error", error.message);
      }
    };
    getUserData();
  }, []);

  const updatePreferences = async () => {
    try {
      setLoading(true);
      setError(false);
      setSuccess(false);

      const updatedData = {
        city: titleCase(userData?.city),
        preferred_fashion_style: titleCase(userData?.preferred_fashion_style),
        accessibility:
          userData?.accessibility.accessibility === "Color Blind"
            ? userData?.colorBlindnessType.colorBlindnessType
            : userData?.accessibility.accessibility,
      };
      await fireStore.addData({ uid: userData?.uid, data: updatedData });
      setSuccess("Preferences updated successfully");
      setTimeout(()=>{
        window.location.reload();
      },1100);
    } catch (error) {
      console.log("Error", error.message);
      setError("Something went wrong, please try again later");
    } finally {
      setLoading(false);
    }
  };
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 px-4 md:px-8">
      <div className="flex items-center mb-8 ">
        <ArrowBackIosIcon
          onClick={() => navigate(-1)}
          className="text-gray-900 hover:text-gray-700 focus:outline-none"
          aria-label="Go back to the previous menu"
        />
        <p className="ml-4 text-3xl font-semibold text-gray-800">
          Account Settings
        </p>
      </div>
      <div className="space-y-7 max-w-2xl lg:mx-auto mt-[5rem]">
        <div>
          <Input
            id="city"
            label="City"
            value={userData?.city}
            onChange={(e) => {
              setUserData({ ...userData, city: e.target.value });
            }}
            style={{
              backgroundColor: "white",
              padding: "20px",
              fontSize: "16px",
              letterSpacing: "0.35px",
              color: "black",
            }}
            placeholder="Enter your city"
          />
        </div>
        <div>
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
            className="w-full bg-white/95 px-3 py-2 rounded-lg border border-gray-300"
            panelClassName="bg-white mt-2 border border-2 border-black p-2 rounded-lg"
          />
          {userData.accessibility.accessibility === "Color Blind" && (
            <div className="my-4">
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
                className="w-full bg-white/95 px-3 py-2 rounded-lg border border-gray-300"
                panelClassName="bg-white mt-2 border border-2 border-black p-2 rounded-lg"
              />
            </div>
          )}
        </div>
        <div>
          <FloatLabel>
            <Input
              id="preferred_fashion_style"
              label="Preferred Fashion Style"
              style={{
                backgroundColor: "white",
                padding: "20px",
                fontSize: "16px",
                letterSpacing: "0.35px",
                color: "black",
              }}
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
      <div className="mt-8 lg:mx-auto text-left lg:text-center max-w-xl ">
        <Button
          color="blue"
          className="w-full py-3 px-6 rounded-lg shadow-lg"
          onClick={updatePreferences}
        >
          Save Settings
        </Button>
      </div>
      {error && (
        <Snackbar
          open={!!error}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={1100}
          onClose={() => setError("")}
        >
          <Alert
            onClose={() => setError("")}
            severity="error"
            sx={{ width: "100%" }}
          >
            {error}
          </Alert>
        </Snackbar>
      )}
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
            {success}
          </Alert>
        </Snackbar>
      )}
      <div>
        {loading && (
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
        )}
      </div>
    </div>
  );
}

export default AccountSettings;
