import React from 'react'
import {Logo, SignIn, Button} from "../components.js";
import { useSelector,useDispatch } from 'react-redux';
import {logoutUser} from "../../store/authSlice/authSlice.js";
import {auth} from "../../Firebase/firebaseServices.js";

function Header() {
  const [isError, setIsError] = React.useState("");
  const {user,email,uid,isAuth}= useSelector((state) => state.auth);
  const dispatch = useDispatch();

  async function signOut(){
    try {
      setIsError(""); // resetting the error state
      await auth.logOut();
      dispatch(logoutUser());
    } catch (error) {
      setIsError(error.message);
      console.log(error.message);
    }
  }
  return (
     <div className="bg-[#131314] flex justify-between py-4 px-8 border-b-4 border-white">
      <Logo />
      <div>
        {isAuth?<h1 className='text-white'>Welcome back, {user}</h1>:<SignIn />}
        {isAuth && <Button  buttonText="Log out  " className="h-fit bg-gradient-to-r from-blue-200 to-blue-400 hover:from-blue-400 hover:to-blue-500 px-2 py-3 rounded-3xl" onClick={signOut} />}
      </div>
   </div>
  )
}

export default Header