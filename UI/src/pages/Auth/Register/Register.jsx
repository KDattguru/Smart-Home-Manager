import { Container, Row, Col, Form, Button } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useDropzone } from "react-dropzone";
import "../../../styles/Register.css";
import uploadIcon from "../../../assets/upload.jpg";

export default function Register() {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    role: "",
    phoneNumber: "",
    password: "",
  });
  const [profilePic, setProfilePic] = useState(null);
  const navigate = useNavigate();

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email || !formData.password) {
      toast.error("Please fill all required fields.");
      return;
    }

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => data.append(key, value));

    if (profilePic) {
      data.append("profile_picture", profilePic);
    }

    try {
      await axios.post("http://127.0.0.1:8000/api/users/register/", data, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("Account created successfully!");
      navigate("/login");
    } catch (err) {
      console.error("Registration Error:", err.response?.data);
      toast.error(err.response?.data?.message || "Registration failed. Try again.");
    }
  };

  const { getRootProps, getInputProps } = useDropzone({
    accept: { "image/jpeg": [".jpg", ".jpeg"], "image/png": [".png"] },
    onDrop: (acceptedFiles) => {
      setProfilePic(acceptedFiles[0]);
    },
  });

  return (
    <Container className="box">
    
      <Row className="justify-content-start mt-5">
      
        <Col md={5}>
          <Form className="register-form-container p-4 shadow rounded" onSubmit={handleSubmit}>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Username</Form.Label>
                  <Form.Control
                    type="text"
                    name="username"
                    placeholder="Enter username"
                    value={formData.username}
                    onChange={(e) => handleInputChange("username", e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Enter email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Role</Form.Label>
                  <Form.Select
                    name="role"
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                  >
                    <option value="">Select role</option>
                    <option value="admin">Admin</option>
                    <option value="member">Member</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phoneNumber"
                    placeholder="Enter phone number"
                    value={formData.phoneNumber}
                    onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                placeholder="Enter password"
                autoComplete="new-password"
                value={formData.password}
                onChange={(e) => handleInputChange("password", e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Profile Picture</Form.Label>
              <div {...getRootProps()} className="dropzone">
                <input {...getInputProps()} />
                <img src={uploadIcon} alt="Upload" className="upload-icon" />
              </div>
              {profilePic && <small className="file-name">{profilePic.name}</small>}
            </Form.Group>

            <Button variant="primary" className="w-100" type="submit">
              Register
            </Button>
            <hr />
            <p className="text-center">
              Already have an account?{" "}
              <span
                className="text-primary"
                style={{ cursor: "pointer" }}
                onClick={() => navigate("/login")}
              >
                Sign in here
              </span>
            </p>
          </Form>
        </Col>

        
        <Col md={6} className="d-flex align-items-center justify-content-start">
          <div className="image-box">
            Register Your Account
          </div>
        </Col>
      </Row>
    </Container>
  );
}
