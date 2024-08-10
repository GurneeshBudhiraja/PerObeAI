import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { auth, fireStore } from "../../firebase/firebaseServices.js";
import { useDispatch } from "react-redux";
import {setUser} from "../../store/authSlice/authSlice.js";
import { useNavigate } from "react-router-dom"; 

function Chat() {
  const [loading, setLoading] = React.useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userData, setUserData] = React.useState({});
  React.useEffect(() => {
    try {
      setLoading(true);
      const getCurrentUser = async () => {
        const { uid, email } = await auth.currentUser();
        if (!uid || !email) {
          navigate("/");
        }
        setUserData({ ...userData, uid, email });
        const firestoreData = await fireStore.getData({ uid });
        const {accessibility,city,preferred_fashion_style} = firestoreData.data;
        const obj = {...userData, accessibility, city, preferred_fashion_style};
        setUserData({ ...userData, accessibility, city, preferred_fashion_style });        
        if (!Object.keys(firestoreData).length) {
          navigate("/")
        } else {
          dispatch(setUser({ ...userData }));
          console.log("User Data", obj);
        }
      };
      getCurrentUser();
    } catch (error) {
      console.log("Not able to fetch user", error.message);
    } finally {
      setLoading(false);
    }
  }, []);

  return <div className="text-black">Chat</div>;
}

export default Chat;
