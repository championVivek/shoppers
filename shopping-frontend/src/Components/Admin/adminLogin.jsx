import React, { useState, useContext } from "react";
import { Form, Button } from "react-bootstrap";
import UserContext from "../Context/userContext";
import { Link, useHistory } from "react-router-dom";
import ErrorNotice from "../ErrorNotice";
import axios from "../../Axios";
import "../User/Login/Login.css";

function AdminLogin() {
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const { setUserData } = useContext(UserContext);
  const [error, setError] = useState("");
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await axios.post("/adminlogin", {
        email: userEmail,
        password: userPassword,
      });
      
      if (result) {
        setUserData({
          token: result.data.token,
          user: result.data.user,
          isAdmin: result.data.isAdmin,
        });
        localStorage.setItem("auth-token", result.data.token);
        localStorage.setItem("isAdmin", result.data.isAdmin);
        history.push("/");
        window.location.reload(true)
      }
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };

  return (
    <div className="login">
      <div className="login__body">
        <h1>Admin Login</h1>
        {error && <ErrorNotice message={error} />}
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
