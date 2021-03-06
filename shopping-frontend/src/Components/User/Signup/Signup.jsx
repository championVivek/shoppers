import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import axios from "../../../Axios";
import "./Signup.css";

function Signup() {
  const [userName, setName] = useState("");
  const [userEmail, setEmail] = useState("");
  const [userPassword, setPassword] = useState("");
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/usersignup", {
        name: userName,
        email: userEmail,
        password: userPassword,
      });
      history.push("/login");
    } catch (err) {
      err.response.data.msg &&
        toast.error(err.response.data.msg, { autoClose: 2000 });
    }
  };

  return (
    <div className="signup">
      <ToastContainer />
      <div className="signup__body">
        <h1>Create Account</h1>
        <Form onSubmit={handleSubmit}>
          <Form.Group>
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter name"
              onChange={(e) => setName(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formBasicEmail">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Enter email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              placeholder="Atleast 5 characters"
              onChange={(e) => setPassword(e.target.value)}
            />
          </Form.Group>
          <Button variant="success" type="submit">
            Signup
          </Button>{" "}
          <Button as={Link} to="/login" variant="secondary">
            Already have an account?
          </Button>
        </Form>
      </div>
    </div>
  );
}

export default Signup;
