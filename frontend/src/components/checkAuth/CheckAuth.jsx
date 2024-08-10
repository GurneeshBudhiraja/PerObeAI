import React from "react";
import { Outlet } from "react-router-dom";
import { auth, fireStore } from "../../firebase/firebaseServices.js";
import { useNavigate } from "react-router-dom";
import { setUser } from "../../store/authSlice/authSlice.js";
import { useDispatch } from "react-redux";

function CheckAuth() {
  const [userData, setUserData] = React.useState({});
  const { navigate } = useNavigate();
  const dispatch = useDispatch();

  React.useEffect(() => {
    const getCurrentUser = async () => {
      const user = await auth.currentUser();

      if (!user) {
        return navigate("/");
      }

      const { uid, email } = user;

      // getting the user preferences from firestore
      const firestoreData = await fireStore.getData({ uid });

      setUserData({ uid, email });

      // will navigate to get-started if user is new
      if (!Object.keys(firestoreData).length) {
        return navigate("/get-started", {
          state: { userData, fromProtectedRoute: true },
        });
      }
      const { preferred_fashion_style, accessibility, city } =
        firestoreData.data;

      dispatch(
        setUser({ uid, email, preferred_fashion_style, accessibility, city })
      );
    };
    getCurrentUser();
    console.log("going thur the check auth");
  }, []);
  return <Outlet />;
}

export default CheckAuth;
