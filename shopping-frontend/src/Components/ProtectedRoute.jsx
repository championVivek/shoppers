import React, { useContext } from "react";
import { Route, Redirect } from "react-router-dom";
import UserContext from "./Context/userContext";

const ProtectedRoute = ({ component: Comp, path, ...rest }) => {
  const { userData } = useContext(UserContext);
  return (
    <Route
      path={path}
      {...rest}
      render={(props) => {
        return userData.isLoggedIn === true ? (
          <Comp {...props} />
        ) : (
          <Redirect to="/login" />
        );
      }}
    />
  );
};

export default ProtectedRoute;
