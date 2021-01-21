import React, { useState, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import UserContext from "../../Context/userContext";
import { Link, useHistory } from "react-router-dom";
import axios from "../../../Axios";
import "./Login.css";

function Login() {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const { setUserData } = useContext(UserContext);
  const history = useHistory();

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      const result = await axios.post("/userlogin", {
        email: userEmail,
        password: userPassword,
      });
      if (result) {
        setUserData({
          token: result.data.token,
          user: result.data.user,
          isAdmin: result.data.isAdmin,
          isLoggedIn: true,
        });
        localStorage.setItem("auth-token", result.data.token);
        localStorage.setItem("isAdmin", result.data.isAdmin);
        history.push("/");
        window.location.reload(true)
      }
    } catch (err) {
      err.response.data.msg &&
        toast.error(err.response.data.msg, { autoClose: 2000 });
    }
  };
  return (
    <div className="login">
      <div className="login__body">
        <h1>Login</h1>
        <ToastContainer />
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
          <Button as={Link} to="/signup" variant="secondary">
            Don't have an account?
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Login;
