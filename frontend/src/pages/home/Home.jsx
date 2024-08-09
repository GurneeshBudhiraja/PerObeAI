import {
  HeroPoints,
  SignInWithGoogleButton,
} from "../../components/components.js";
import { auth } from "../../firebase/firebaseServices.js";
function Home() {
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
  const gogleSignIn = async () => {
    const userData = await auth.logInWithGoogle();
    const user = userData.user;
    console.log(user);
  };
  return (
    <div className="bg-[#131313] h-screen w-screen text-zinc-100 flex ">
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
        <SignInWithGoogleButton onClick={gogleSignIn} />
      </div>

      <div id="hero-section-right">
        {/* TODO: WILL ADD THE PICTURES LATER ON ONCE THE APP IS READY */}
      </div>
    </div>
  );
}

export default Home;
