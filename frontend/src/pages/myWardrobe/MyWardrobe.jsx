import { useEffect, useState, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

// Components
import { Snackbar, Alert, CircularProgress, Backdrop } from "@mui/material";

// Firebase services
import { auth, fireStore } from "../../firebase/firebaseServices.js";

// Utility functions
import { fetchPictures } from "./myWardrobeUtils/utils.js";

// Store actions
import { setUser } from "../../store/authSlice/authSlice.js";

function MyWardrobe() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  // For scrolling to the selected image
  const imageRefs = useRef([]);

  // For active image
  const [active, setActive] = useState(null);

  // User data from the store
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

        // Update the state in the store
        dispatch(setUser(storeData));
      } catch (error) {
        setError("Something went wrong. Please try again later.");

        setLoading(false);

        setTimeout(() => navigate("/"), 1000);
      }
    };

    const fetchPicturesData = async () => {
      try {
        // Getting pictures from Firebase storage
        const pictures = await fetchPictures(user.uid);

        // By default, set the first picture as active
        setActive(pictures[0].url);

        // Updating the state with the fetched pictures
        setFirestorePictures(pictures);
      } catch (error) {
        setError("Something went wrong while fetching pictures.");
        setTimeout(() => navigate("/"), 1000);
      } finally {
        setLoading(false);
      }
    };

    setLoading(true);

    // Check if the user is authenticated
    if (!user.isAuth) {
      fetchUser();
    } else {
      fetchPicturesData();
    }

    // Cleanup function
    return () => {
      setError("");
      setLoading(false);
    };
  }, [user, dispatch, navigate]);

  return (
    <div className="bg-gradient-to-tl from-[#feab5e7b] via-[#c779d06a] to-[#4bc0c86b] h-full w-full overflow-scroll flex justify-center items-center p-4">
      <div className="grid gap-4 m-4 md:m-0 md:my-4">
        {/* Current selected Image */}
        <div className="h-64 md:h-auto ">
          <img
            src={active}
            className="h-full w-full max-w-full rounded-2xl shadow-lg shadow-black  object-contain object-center md:h-[480px]"
          />
        </div>

        {/* Image scroll bar */}
        <div className="overflow-x-auto mx-auto max-w-4xl snap-x snap-mandatory ">
          <div className="flex space-x-4 py-4">
            {firestorePictures.map((picture, index) => (
              <div
                key={index}
                className="flex-shrink-0 snap-center"
                ref={(el) => (imageRefs.current[index] = el)}
              >
                <img
                  onClick={() => {
                    imageRefs.current[index].scrollIntoView({
                      behavior: "smooth",
                      inline: "center",
                    });
                    setActive(picture.url);
                  }}
                  src={picture.url}
                  alt={"Picture " + index}
                  className={`h-20 max-w-full cursor-pointer rounded-lg object-contain ${
                    active === picture.url ? "border-2 border-blue-500" : ""
                  }`}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Loading indicator for image fetching */}
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
