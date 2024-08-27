import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

// Store action
import { setUser } from "../../store/authSlice/authSlice.js";

// Icons and components
import { Dropdown } from "primereact/dropdown";
import { Input } from "@material-tailwind/react";
import { FloatLabel } from "primereact/floatlabel";
import Backdrop from "@mui/material/Backdrop";
import CircularProgress from "@mui/material/CircularProgress";
import { Button } from "@material-tailwind/react";
import { Snackbar, Alert } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";

// Firebase services
import { fireStore, auth } from "../../firebase/firebaseServices.js";

// Utility function
import { updatePreferences } from "./accountSettingsUtils/accountSettingsUtils.js";

// Constants for the dropdowns
import {
  accessibilities,
  colorBlindnessType,
} from "./accountSettingsConstants.js";

function AccountSettings() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(false);

  // User data from the redux store
  const storeUserData = useSelector((state) => state.auth);

  const [userData, setUserData] = useState({
    uid: "",
    email: "",
    city: "",
    accessibility: "",
    preferred_fashion_style: "",
    accessToken: "",
  });

  useEffect(() => {
    setError(false);
    const getUserData = async () => {
      try {
        const storeData = {
          uid: storeUserData?.uid,
          email: storeUserData?.email,
          accessToken: storeUserData?.accessToken,
        };

        // Current user data using Firebase Auth if not available in the store
        if (!storeData?.uid || !storeData?.email) {
          const currentUser = await auth.currentUser();
          const uid = currentUser?.uid;
          const email = currentUser?.email;
          const accessToken = currentUser?.accessToken;
          storeData.uid = uid;
          storeData.email = email;
          storeData.accessToken = accessToken;

          // Navigate to the home page if the user is not authenticated
          if (!uid) {
            return navigate("/");
          }

          // Updating the state with the user uid, email and accessToken  fetched from Firebase Auth
          setUserData({ ...userData, uid, email, accessToken });
        } else {
          // Updating the state with the uid, email and accessToken from the store
          setUserData({
            ...userData,
            uid: storeData?.uid,
            email: storeData?.email,
            accessToken: storeData?.accessToken,
          });
        }

        // User choices from the Firebase Firestore
        const userChoices = await fireStore.getData({ uid: storeData?.uid });
        // Destructuring the user choices
        const { city, accessibility, preferred_fashion_style } = userChoices;

        // Updating the state with the user choices
        // When accessibility is Blind or None
        if (accessibility === "Blind" || accessibility === "None") {
          setUserData((prev) => ({
            ...prev,
            city,
            accessibility: { accessibility },
            preferred_fashion_style,
          }));
        } else {
          // When accessibility is Color Blind
          setUserData((prev) => ({
            ...prev,
            city,
            accessibility: { accessibility: "Color Blind" },
            colorBlindnessType: { colorBlindnessType: accessibility },
            preferred_fashion_style,
          }));
        }

        // Updating the store with the user data
        dispatch(
          setUser({
            city,
            preferred_fashion_style,
            accessibility,
            uid: storeData?.uid,
            email: storeData?.email,
            isAuth: true,
            accessToken: storeData?.accessToken,
          })
        );
      } catch (error) {
        setError(true);
      }
    };
    getUserData();
  }, [dispatch, navigate, storeUserData]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 px-4 md:px-8">
      <div className="flex items-center mb-8 ">
        <ArrowBackIosIcon
          onClick={() => navigate(-1)}
          className="text-gray-900 hover:text-gray-700 focus:outline-none cursor-pointer"
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
          onClick={() =>
            updatePreferences({
              setLoading,
              setError,
              setSuccess,
              userData,
            })
          }
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
