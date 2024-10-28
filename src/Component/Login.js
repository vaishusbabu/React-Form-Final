import React, { useState } from "react";
import "../assets/login.css";
import Header from "./Header";
import axios from 'axios'; 
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [healthCareNumber, setHealthCareNumber] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({
    healthCareNumber: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false); 
  const [errorMessage, setErrorMessage] = useState(""); 
  const navigate = useNavigate();

  const validateField = (name, value) => {
    let errorMessage = "";

    if (name === "healthCareNumber") {
      if (!value) {
        errorMessage = "HealthCare Number is required.";
      } else if (!/^\d{14}$/.test(value)) {
        errorMessage = "Must be 14 digits and only numbers.";
      }
    } else if (name === "email") {
      if (!value) {
        errorMessage = "Email is required.";
      } else if (!validateEmail(value)) {
        errorMessage = "Invalid email format.";
      }
    } else if (name === "password") {
      if (!value) {
        errorMessage = "Password is required.";
      } else if (!validatePassword(value)) {
        errorMessage = "Must contain at least one uppercase, lowercase, number, and special character.";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: errorMessage }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === "healthCareNumber") setHealthCareNumber(value);
    else if (name === "email") setEmail(value);
    else if (name === "password") setPassword(value);

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let validationErrors = {};

    if (!healthCareNumber) {
      validationErrors.healthCareNumber = "HealthCare Number is required.";
    } else if (!/^\d{14}$/.test(healthCareNumber)) {
      validationErrors.healthCareNumber = "Must be 14 digits and only numbers.";
    }

    if (!email) {
      validationErrors.email = "Email is required.";
    } else if (!validateEmail(email)) {
      validationErrors.email = "Invalid email format.";
    }

    if (!password) {
      validationErrors.password = "Password is required.";
    } else if (!validatePassword(password)) {
      validationErrors.password = "Must contain at least one uppercase, lowercase, number, and special character.";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      setLoading(true);
      setErrorMessage("");
      try {
        const loginRequest = { healthCareNumber, email, password };
        const response = await axios.post('http://localhost:8083/api/users/login', loginRequest);

        console.log("Login successful:", response.data);
        
        localStorage.setItem('user', JSON.stringify(response.data));

        navigate("/welcomepage");
        
      } catch (error) {
        console.error("Login failed:", error);
        if (error.response) {
          const backendMessage = error.response.data?.message;

          if (error.response.status === 401) {
            setErrorMessage("Unauthorized access - check your credentials.");
          } else if (backendMessage === "HealthCare Number doesn't exist") {
            setErrors((prev) => ({ ...prev, healthCareNumber: backendMessage }));
          } else if (backendMessage === "Email doesn't exist") {
            setErrors((prev) => ({ ...prev, email: backendMessage }));
          } else {
            setErrorMessage(backendMessage || "Login failed");
          }
        } else {
          setErrorMessage("An unexpected error occurred. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="loginmain">
      <Header />
      <div className="login-container">
        <h2 className="heading">Login</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="healthCareNumber">HealthCare Number :</label>
            <input
              type="text"
              id="healthCareNumber"
              name="healthCareNumber"
              value={healthCareNumber}
              onChange={handleChange}
              onBlur={handleBlur}
              maxLength="14"
            />
            {errors.healthCareNumber && (
              <p className="error">{errors.healthCareNumber}</p>
            )}
          </div>
          <div>
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={email}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>
          <div>
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.password && (
              <p className="error">{errors.password}</p>
            )}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? "Logging In..." : "Log In"}
          </button>

          {errorMessage && <p className="error">{errorMessage}</p>} 

          <div className="forgot-password">
            <a href="/forgotpassword">Forgot Password?</a>
          </div>
          <div className="register-link">
            <p>
              Not registered? <a href="/register">Create an account</a>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
