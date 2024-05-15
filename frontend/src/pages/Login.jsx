import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

export default function Login() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const baseUrl = "http://localhost:8000/api";

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/login/`, formData);

      if (response.status === 201) {
        alert("User logged in successfully");

        const accessToken = response.data.access;
        const refreshToken = response.data.refresh;

        Cookies.set("accessToken", accessToken);
        Cookies.set("refreshToken", refreshToken);

        navigate("/");
      }
    } catch (err) {
      setError("Error while trying to login. Please try again later.");
    }

    setIsLoading(false);
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          <h3>Sign in to your account</h3>
        </Card.Title>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="my-3">
            <Form.Label>Email address</Form.Label>
            <Form.Control
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="Enter email"
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              placeholder="Password"
            />
          </Form.Group>

          <Button disabled={isLoading} variant="primary" type="submit">
            Login
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
