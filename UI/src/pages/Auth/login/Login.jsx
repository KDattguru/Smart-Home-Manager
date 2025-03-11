import {
  Anchor,
  Button,
  Paper,
  PasswordInput,
  Text,
  TextInput,
  
  Loader,
} from "@mantine/core";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { setAuthToken } from "../../../utils/localStorage";
import axios from "axios";
import { toast } from "react-hot-toast";
import "../../../styles/Login.css";
import projlogo from "../../../assets/logo-3.png";


export default function Login({ setAuthTokenState }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:8000/api/users/login/", {
        email,
        password,
      });

      if (response?.data?.access_token && response?.data?.username) {
        setAuthToken(response.data.access_token);

        if (typeof setAuthTokenState === "function") {
          setAuthTokenState(true);
        }

        localStorage.setItem(
          "user",
          JSON.stringify({
            id: response.data.id,
            username: response.data.username,
            email: response.data.email,
            role: response.data.role,
            profile_picture: response.data.profile_picture
              ? `${BASE_URL}${response.data.profile_picture}`
              : null,
          })
        );

        window.dispatchEvent(new Event("storage"));
        toast.success("Login successful!");

        setTimeout(() => navigate("/dashboard"), 200);
      } else {
        toast.error("Invalid credentials or missing user data.");
      }
    } catch (err) {
      console.error("Login Error:", err.response ? err.response.data : err.message);
      toast.error(err.response?.data?.detail || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    
      {!showForm && (
        <div className="login-background">
          <h1 className="Homebox"> Smart Home Manager</h1>
          <motion.div
            className="floating-button"
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: [0, -10, 0], opacity: 1 }}
            transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
            onClick={() => setShowForm(true)}
          >
            <img src={projlogo} alt="Login" className="login-icon" />
          </motion.div>
        </div>
      )}

    
      <AnimatePresence>
        {showForm && (
          <motion.div
            className="login-container"
            initial={{ opacity: 0, scale: 0.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
             <h3 ta="center" className="Homebox-two">
                Login To
              </h3>
              <h3 ta="center" className="Homebox-three">
              Home Manager
              </h3>
            <Paper  p={30} mt={30} radius="md" className="logbox">
             

              <form onSubmit={handleLogin}>
                <TextInput
                  label="Email"
                  name="email"
                  placeholder="Enter email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <PasswordInput
                  label="Password"
                  name="password"
                  placeholder="Your password"
                  required
                  mt="md"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <Button fullWidth mt="xl" type="submit" disabled={loading}>
                  {loading ? <Loader size="sm" color="white" /> : "Sign in"}
                </Button>
              </form>

              <hr />
              <Text c="dark" size="sm" ta="center" mt={5}>
                Don't have an account yet?{" "}
                <Anchor size="sm" component="button" onClick={() => navigate("/register")}>
                  Create account
                </Anchor>
              </Text>

              <Button 
                variant="light"
                color="black"
              
                mt="md"
                onClick={() => setShowForm(false)}
              >
                Close
              </Button>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
