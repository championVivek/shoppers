import React, { useState } from "react";
import { Form, Button } from "react-bootstrap";
import { Link, useHistory } from "react-router-dom";
import ErrorNotice from '../../ErrorNotice'
import axios from "../../../Axios";
import "./Signup.css";

function Signup() {
  const [userName, setName] = useState("");
  const [userEmail, setEmail] = useState("");
  const [userPassword, setPassword] = useState("");
  const [error, setError] = useState("");
  const history = useHistory();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/usersignup", {
        name: userName,
        email: userEmail,
        password: userPassword,
      });
      console.log("User created");
      history.push("/login");
    } catch(err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };

  return (
    <div className="signup">
      <div className="signup__body">
        <h1>Create Account</h1>
        {error && <ErrorNotice message={error}/>}
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
          <Form.Group controlId="formBasicPassword">
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