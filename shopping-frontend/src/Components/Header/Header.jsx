import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { NavDropdown, Button } from "react-bootstrap";
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import SearchIcon from "@material-ui/icons/Search";
import UserContext from "../Context/userContext";
import BasketContext from "../Context/basketContext";
import "./Header.css";

function Header() {
  const { state, dispatch } = useContext(UserContext);
  const { basket } = useContext(BasketContext);
  const history = useHistory();

  const logout = () => {
    dispatch({ type: 'SETUSER', token: undefined, id: undefined, username: undefined, isAdmin: undefined, isLoggedIn: false });
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
      <div className="header__nav__left">
        <Link to="/">Home</Link>
      </div>
      <div className="header__search">
        <input type="text" className="header__searchInput" />
        <SearchIcon className="header__searchIcon" />
      </div>
      {state.id && state.isAdmin === "false" ? (
        <div className="header__nav">
          <Link to="/myorders">
            Orders
          </Link>
          <Button variant="link" onClick={logout}>
            Logout
          </Button>
          <div className="header__basket">
            <Link
              className="header__basket__link"
              to={`/basket/${state.id}`}
            >
              <ShoppingCartIcon />
              <span>{basket}</span>
            </Link>
          </div>
        </div>
      ) : state.id && state.isAdmin === "true" ? (
        <div className="header__nav">
          <Link
            to={`/admin/products`}
          >
            Products
          </Link>
          <Link
            to="/admin/add_product"
          >
            Add Product
          </Link>
          <Link
            onClick={logout}
          >
            Logout
          </Link>
        </div>
      ) : (
        <div className="header__nav">
          <NavDropdown title="Login" id="basic-nav-dropdown" className="header__nav__dropdown">
            <NavDropdown.Item as={Link} to="/login">
              As User
            </NavDropdown.Item>
            <NavDropdown.Item as={Link} to="/admin/login">
              As Seller
            </NavDropdown.Item>
          </NavDropdown>

          <NavDropdown title="Signup" id="basic-nav-dropdown" className="header__nav__dropdown">
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
