import React from 'react'
import { useSelector,useDispatch } from 'react-redux';
import {auth} from "../../Firebase/firebaseServices.js";
import { useNavigate, Outlet} from 'react-router-dom';
function IsAuthenticate() {
  const [isAuth, setIsAuth] = React.useState(false); // boolean to check if the user is authenticated
  const navigate = useNavigate();
  const isUserAuth = useSelector((state)=>state.auth.isAuth);
  React.useEffect(()=>{
   if(isUserAuth){
     setIsAuth(true);
   } else{
     const retrieveUser = async () => {
       try {
         const {displayName:user,email,uid} = await auth.currentUser();
         if([user,email,uid].some((element)=>!element)){
           setIsAuth(false);
         }
         setIsAuth(true);
       } catch (error) {
         console.log(error.message);
       }
     };
     retrieveUser();
   }
  },[])
  return (
    isAuth?navigate('/'): <Outlet />
  )
}

export default IsAuthenticate