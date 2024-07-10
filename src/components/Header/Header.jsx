import React, { useId } from "react";
import {Link} from "react-router-dom";
import {useSelector, useDispatch} from "react-redux";
import { logoutUser } from "../../store/authSlice/authSlice.js";
import { Logo, Button } from "../components.js";
import { v4 as uuidv4 } from "uuid";
import {auth} from "../../Firebase/firebaseServices.js"; 
function Header() {
  const isAuth = useSelector((state)=>state.auth.isAuth);
  const dispatch = useDispatch();
  const options=[
    {
      name: "Sign Up",
      link: "/signup",
      show: isAuth?false:true,
    },
    {
      name: "Log In",
      link: "/login",
      show: isAuth?false:true,
    },
    {
      name: "Log Out",
      link: "/",
      show: isAuth?true:false,
      action: "logOutUser",
    },
  ];

  return (
    <div className="bg-black border-b-2 border-blue-400 text-white flex justify-between items-center ">
      <Logo />
      <ul className="flex gap-4">
        {
          options.map((option)=>{
            const id = uuidv4();
            if(option.show === true){
              return (
                <li key={id}>
                <Link to={option.link} className="text-white">
                  <Button buttonText={option.name} 
                  onClick={
                    option.action && 
                    (async ()=>{
                      try {
                        await auth.logOut();
                      } catch (error) {
                        console.log(error.message);
                      } finally{
                        dispatch(logoutUser());
                        setTimeout(()=>{
                          window.location.reload(); // reload the page
                        },1000);
                      }
                    })
                  }
                  
                  />
                </Link>
              </li>
            )
          }
          })
        }

      </ul>

    </div>
  )
}

export default Header