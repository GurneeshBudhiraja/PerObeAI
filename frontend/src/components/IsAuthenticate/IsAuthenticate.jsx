import React from "react";
import { useSelector } from "react-redux";
import { useNavigate, Outlet } from "react-router-dom";

// Firebase service
import { auth } from "../../Firebase/firebaseServices.js";

function IsAuthenticate() {
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = React.useState(false);
  const isUserAuth = useSelector((state) => state.auth.isAuth);

  React.useEffect(() => {
    if (isUserAuth) {
      setIsAuth(true);
    } else {
      const retrieveUser = async () => {
        try {
          const { displayName: user, email, uid } = await auth.currentUser();

          if ([user, email, uid].some((element) => !element)) {
            setIsAuth(false);
          }
          setIsAuth(true);
        } catch (error) {
          setIsAuth(false);

          return;
        }
      };
      retrieveUser();
    }
  }, []);
  return isAuth ? navigate("/") : <Outlet />;
}

export default IsAuthenticate;
