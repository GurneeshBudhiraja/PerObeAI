heimport { auth } from "../../Firebase/firebaseServices.js";
import {useDispatch} from "react-redux";
import { setUser } from "../../store/authSlice/authSlice.js";
const SignIn = () => {
  const dispatch = useDispatch();

  const logGoogleUser = async () => {
    try {
      const result = await auth.logInWithGoogle();
      const {displayName:user,email,uid} = result.user;
      if([user,email,uid].some((element)=>!element)){
        throw new Error("SignIn :: Error in fetching user data");
      } 
      dispatch(setUser({user,email,uid}));
      console.log(result);
    } catch (error) {
      console.log(error.message);
    }
  };
  return (
    <div>
      <button onClick={logGoogleUser} className="h-fit bg-gradient-to-r from-blue-200 to-blue-400 hover:from-blue-400 hover:to-blue-500 
    px-2 py-3 rounded-3xl">Sign In With Google</button>
    </div>
  );
};
export default SignIn;
