import React, {useEffect, useContext } from "react";
import UserContext from "../Context/userContext";
import BasketContext from "../Context/basketContext";
import { Link, useHistory } from "react-router-dom";
import { NavDropdown } from "react-bootstrap";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import SearchIcon from "@material-ui/icons/Search";
import axios from "../../Axios"
import "./Header.css";

function Header() {
  const { userData, setUserData } = useContext(UserContext);
  const { basket, setBasket } = useContext(BasketContext);
  const history = useHistory();

    const logout = () => {
    setUserData({ token: undefined, user: undefined, isAdmin: null });
    localStorage.setItem("auth-token", "");
    localStorage.setItem("isAdmin", null);
    history.push("/");
    window.location.reload(false);
  };

 

  return (
    <nav className="header">
      <div className="header__brand">
        <h1>SHOPPERS</h1>
      </div>
      <div className="header__nav">
        <Link
          to="/"
          className="header__link"
          style={{ textDecoration: "none" }}
        >
          Home
        </Link>
      </div>
      <div className="header__search">
        <input type="text" className="header__searchInput" />
        <SearchIcon className="header__searchIcon" />
      </div>
      {userData.user && userData.isAdmin === "false" ? (
        <div className="header__nav">
          <Link
            to="/myorders"
            className="header__link"
            style={{ textDecoration: "none" }}
          >
            Orders
          </Link>
          <Link
            onClick={logout}
            className="header__link"
            style={{ textDecoration: "none" }}
          >
            Logout
          </Link>
          <div className="header__basket">
            <Link
              className="header__basket__link"
              to={`/basket/${userData.user.id}`}
            >
              <ShoppingCartIcon />
              <span>{basket}</span>
            </Link>
          </div>
        </div>
      ) : userData.user && userData.isAdmin === "true" ? (
        <div className="header__nav">
          <Link
            to={`/admin/${userData.user.id}/products`}
            className="header__link"
            style={{ textDecoration: "none" }}
          >
            Products
          </Link>
          <Link
            to="/admin/add_product"
            className="header__link"
            style={{ textDecoration: "none" }}
          >
            Add Product
          </Link>
          <Link
            onClick={logout}
            className="header__link"
            style={{ textDecoration: "none" }}
          >
            Logout
          </Link>
        </div>
      ) : (
        <div className="header__nav">
          <NavDropdown title="Login" id="basic-nav-dropdown">
            <NavDropdown.Item as={Link} to="/login">
              As User
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/admin/login">
              As Seller
            </NavDropdown.Item>
          </NavDropdown>

          <NavDropdown title="Signup" id="basic-nav-dropdown">
            <NavDropdown.Item as={Link} to="/signup">
              As User
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/admin/signup">
              As Seller
            </NavDropdown.Item>
          </NavDropdown>
        </div>
      )}
    </nav>
  );
}

export default Header;
