import React from "react";
import {
  HeroPoints,
  SignInWithGoogleButton,
} from "../../components/components.js";
import googleSignIn from "../../utils/googleSignIn.js";
import {auth, fireStore} from "../../firebase/firebaseServices.js";
import { redirect, useNavigate } from "react-router-dom";



function Home() {
  const [userData, setUserData] = React.useState({});
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();
  React.useEffect(()=>{
    try {
      setLoading(true);
      const getCurrentUser = async () => {
        const {uid, email} = await auth.currentUser();
        setUserData({...userData, uid, email});
        const firestoreData = await fireStore.getData({uid});
        if(!Object.keys(firestoreData).length){
          return;
        } else{
          navigate("/chat");
        }
      };
      getCurrentUser();
      
    } catch (error) {
      console.log("Not able to fetch user", error.message);
    } finally{
      setLoading(false);
    }
  },[navigate, setLoading, setUserData]);

  const googleSignInWrapper = async () =>{
    const userData = await googleSignIn();
    if(userData.isNewUser){
      console.log("New User");
      return navigate("/get-started",{state: {userData, fromHomePage: true}});
    } else {
      console.log("Existing User");
    }
    return
  }
  // TODO: WILL IMPORT IT FROM SOMEWHERE ELSE
  const bulletPoints = [
    {
      text: "Carry your wardrobe in your pocket",
      keypoints: ["testing"],
    },
    {
      text: "Make your wardrobe smart and accessible",
      keypoints: ["testing2"],
    },
    {
      text: "Get outfit suggestions based on the weather, occasion, and your style and that too without from your wardrobe",
      keypoints: ["testing3"],
    },
  ];

  return (
    <div className="bg-[#131313] h-screen w-screen text-zinc-100 flex text-white">
      {loading && <div>Loading...</div>}
      <div className="" id="hero-section-left">
        <div>PerObe AI - Your Personal Wardrobe A.I.</div>
        <div className="max-w-md">
          {bulletPoints.map((point, index) => {
            return (
              <HeroPoints
                key={index}
                text={point.text}
                keypoints={point.keypoints}
              />
            );
          })}
        </div>
        <SignInWithGoogleButton onClick={googleSignInWrapper} />
      </div>

      <div id="hero-section-right">
        {/* TODO: WILL ADD THE PICTURES LATER ON ONCE THE APP IS READY */}
      </div>
    </div>
  );
}

export default Home;
