import React, { useState, useEffect, useMemo } from "react";
import { Switch, Route } from "react-router-dom";
import axios from "./Axios";

import UserContext from "./Components/Context/userContext";
import BasketContext from "./Components/Context/basketContext";
import Home from "./Components/Home/Home";
import Header from "./Components/Header/Header";
import Login from "./Components/User/Login/Login";
import Signup from "./Components/User/Signup/Signup";
import AdminSignup from "./Components/Admin/adminSignup";
import AdminLogin from "./Components/Admin/adminLogin";
import AddProduct from "./Components/Admin/AddProduct";
import Products from "./Components/Admin/Products";
import EditProduct from "./Components/Admin/EditProduct/EditProduct";
import Cart from "./Components/cart/Cart";
import Checkout from "./Components/checkout/Checkout";
import Orders from "./Components/Orders/Orders";
import ProtectedRoute from "./ProtectedRoute";
import "./App.css";

function App() {
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
    isAdmin: null,
    isLoggedIn: false,
  });
  const [basket, setBasket] = useState(0);

  const value = useMemo(
    () => ({
      userData,
      setUserData,
    }),
    [userData]
  );

  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      let isAdmin = localStorage.getItem("isAdmin");
      if (token === null) {
        localStorage.setItem("auth-token", "");
        localStorage.setItem("isAdmin", null);
        token = " ";
      }
      const tokenRes = await axios.post("/tokenisvalid", null, {
        headers: { "x-auth-token": token, isAdmin: isAdmin },
      });
      if (tokenRes.data) {
        const userRes = await axios.get("/", {
          headers: { "x-auth-token": token, isAdmin: isAdmin },
        });
        setUserData({
          token,
          user: userRes.data,
          isAdmin: userRes.data.isAdmin,
          isLoggedIn: true,
        });
      }
    };
    checkLoggedIn();
  }, []);

  useEffect(() => {
    if (userData.user) {
      axios.post("/gettotal", { userId: userData.user.id }).then((totalsum) => {
        setBasket(totalsum.data.totalQuantity);
      });
    }
  });

  return (
    <React.Fragment>
      <UserContext.Provider value={value}>
        <BasketContext.Provider value={{ basket, setBasket }}>
          <Header />
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/signup" component={Signup} />
            <Route path="/admin/signup" component={AdminSignup} />
            <Route path="/admin/login" component={AdminLogin} />
            <ProtectedRoute path="/admin/add_product" component={AddProduct} />
            <ProtectedRoute path="/admin/:id/products" component={Products} />
            <ProtectedRoute
              path="/admin/:id/editproduct"
              component={EditProduct}
            />
            <ProtectedRoute path="/checkout" component={Checkout} />
            <ProtectedRoute path="/myorders" component={Orders} />
            <ProtectedRoute path="/basket/:id" component={Cart} />
            <Route path="/" component={Home} />
          </Switch>
        </BasketContext.Provider>
      </UserContext.Provider>
    </React.Fragment>
  );
}

export default App;
