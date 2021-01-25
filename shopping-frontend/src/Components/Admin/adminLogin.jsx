import React, { useState, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import UserContext from "../Context/userContext";
import axios from "../../Axios";
import "../User/Login/Login.css";

function AdminLogin() {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const { dispatch } = useContext(UserContext);
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("/adminlogin", {
        email: userEmail,
        password: userPassword,
      });

      if (result) {
        dispatch({
          type: "SETUSER",
          token: result.data.token,
          id: result.data.user.id,
          username: result.data.user.username,
          isAdmin: result.data.isAdmin,
          isLoggedIn: true
        });
        localStorage.setItem("auth-token", result.data.token);
        localStorage.setItem("isAdmin", result.data.isAdmin);
        history.push("/");
        window.location.reload(false);
      }
    } catch (err) {
      err.response.data.msg &&
        toast.error(err.response.data.msg, { autoClose: 2000 });
    }
  };

  return (
    <div className="login">
      <ToastContainer />
      <div className="login__body">
        <h1>Seller Login</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              onChange={(e) => setUserEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Atleast 5 characters"
              onChange={(e) => setUserPassword(e.target.value)}
            />
          </Form.Group>
          <Button variant="success" type="submit">
            Login
          </Button>{" "}
          <Button as={Link} to="/admin/signup" variant="secondary">
            Don't have an account?
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default AdminLogin;
