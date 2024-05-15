import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Card from "react-bootstrap/Card";
import Alert from "react-bootstrap/Alert";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    password_confirm: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const baseUrl = "http://localhost:8000/api";

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setIsLoading(true);

    try {
      const response = await axios.post(`${baseUrl}/register/`, formData);

      if (response.status === 201) {
        alert("User created successfully");
        navigate("/");
      }
    } catch (err) {
      setError("Error. Cannot register now. Please try again later.");
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          <h3>Create an account</h3>
        </Card.Title>

        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleSubmit}>
          <Form.Group className="my-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={(e) =>
                setFormData({ ...formData, username: e.target.value })
              }
              placeholder="Enter username"
            />
          </Form.Group>

          <Form.Group className="mb-3">
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

          <Form.Group className="mb-3">
            <Form.Label>Confirm Password</Form.Label>
            <Form.Control
              type="password"
              id="password_confirm"
              name="password_confirm"
              value={formData.password_confirm}
              onChange={(e) =>
                setFormData({ ...formData, password_confirm: e.target.value })
              }
              placeholder="Confirm Password"
            />
          </Form.Group>

          <Button disabled={isLoading} variant="primary" type="submit">
            Register Now
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
}
