import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Snackbar, Alert, CircularProgress, Backdrop } from "@mui/material";

import { auth, fireStore } from "../../firebase/firebaseServices.js";
import { fetchPictures } from "./myWardrobeUtils/utils.js";
import { setUser } from "../../store/authSlice/authSlice.js";
import { ImageGallery } from "../../components/components.js";

function MyWardrobe() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const user = useSelector((state) => state.auth);
  const [firestorePictures, setFirestorePictures] = useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await auth.currentUser();

        const { uid, email, accessToken } = currentUser || {};

        if (!uid) {
          navigate("/");
          return;
        }

        const { accessibility, city, preferred_fashion_style } =
          await fireStore.getData({ uid });

        const storeData = {
          uid,
          email,
          accessToken,
          accessibility,
          city,
          preferred_fashion_style,
          isAuth: true,
        };

        dispatch(setUser(storeData));
      } catch (error) {
        setError("Something went wrong. Please try again later.");

        setLoading(false);

        setTimeout(() => navigate("/"), 1000);
      }
    };

    const fetchPicturesData = async () => {
      try {
        const pictures = await fetchPictures(user.uid);

        setFirestorePictures(pictures);
      } catch (error) {
        setError("Something went wrong while fetching pictures.");

        setTimeout(() => navigate("/"), 1000);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);

    if (!user.isAuth) {
      fetchUser();
    } else {
      fetchPicturesData();
    }

    // Cleanup function
    return () => {
      setError("");
      setLoading(false);
      setFirestorePictures([]);
    };
  }, [user, dispatch, navigate]);

  return (
    <div>
      <div>
        {firestorePictures && 
        <ImageGallery pictures={firestorePictures} />
        }
      </div>

      {/* Loading UI */}
      {loading && (
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={loading}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
      )}

      {/* Error message */}
      {error && (
        <Snackbar
          open={!!error}
          anchorOrigin={{ vertical: "top", horizontal: "right" }}
          autoHideDuration={1800}
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
    </div>
  );
}

export default MyWardrobe;
