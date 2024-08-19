import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

import { auth, fireStore, storage } from "../../firebase/firebaseServices.js";
import { fetchPictures } from "./myWardrobeUtils/utils.js";
import { setUser } from "../../store/authSlice/authSlice.js";

function MyWardrobe() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state) => state.auth);
  const [firestorePictures, setFirestorePictures] = React.useState([]);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const currentUser = await auth.currentUser();

        const { uid, email, accessToken } = currentUser || {};

        if (!uid) {
          return navigate("/");
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

        return;
      } catch (error) {
        console.log(error);
      }
    };

    if (!user.isAuth) {
      fetchUser();
    }
    fetchPictures(user.uid).then((pictures) => {
      setFirestorePictures(pictures);
    });
  }, [user, dispatch, navigate]);

  return (
    <div>
      {firestorePictures &&
        firestorePictures.map((picture, index) => {
          return (
            <img
              src={picture.url}
              key={index}
              loading="lazy"
              alt={`Picture ${index}`}
            />
          );
        })}
    </div>
  );
}

export default MyWardrobe;
