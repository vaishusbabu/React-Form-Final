import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "./Header";
import axios from 'axios';

function ForgotPassword() {
  const navigate = useNavigate(); 
  const [form, setForm] = useState({
    healthCareNumber: "",
    email: ""
  });

  const [errors, setErrors] = useState({
    healthCareNumber: "",
    email: ""
  });

  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const validateHealthCareNumber = (number) => {
    return /^\d{14}$/.test(number);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({
      ...form,
      [name]: value
    });

    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    let error = "";

    if (name === "healthCareNumber") {
      if (!value) {
        error = "Health Care Number is required.";
      } else if (!validateHealthCareNumber(value)) {
        error = "Health Care Number must be 14 digits.";
      }
    } else if (name === "email") {
      if (!value) {
        error = "Email is required.";
      } else if (!validateEmail(value)) {
        error = "Invalid email format.";
      }
    }

    setErrors((prev) => ({ ...prev, [name]: error }));
  };

  const handleGenerateOTP = async (e) => {
    e.preventDefault();
    let formErrors = {};

    if (!form.healthCareNumber) {
      formErrors.healthCareNumber = "Health Care Number is required.";
    } else if (!validateHealthCareNumber(form.healthCareNumber)) {
      formErrors.healthCareNumber = "Health Care Number must be 14 digits.";
    }

    if (!form.email) {
      formErrors.email = "Email is required.";
    } else if (!validateEmail(form.email)) {
      formErrors.email = "Invalid email format.";
    }

    if (Object.keys(formErrors).length > 0) {
      setErrors(formErrors);
    } else {
      setErrors({});
      setSuccessMessage("");
      setErrorMessage("");

      try {
        const response = await axios.post('http://localhost:8083/api/users/forgot-password', form);

        setSuccessMessage(response.data.message || "OTP sent to your email.");
        
        
        navigate("/resetpassword"); 

        setForm({ healthCareNumber: "", email: "" }); 
        
      } catch (error) {
        const backendMessage = error.response?.data?.message || "An error occurred. Please try again.";
        setErrorMessage(backendMessage);
      }
    }
  };

  return (
    <div>
      <Header />
      <div className="container">
        <div className="forgot-container">
          <form className="main" onSubmit={handleGenerateOTP}>
            <div className="form-group">
              <h2 className="heading">Forgot Password</h2>

              <label htmlFor="healthCareNumber">Health Care Number:</label>
              <input
                type="text"
                id="healthCareNumber"
                name="healthCareNumber"
                className={`field ${errors.healthCareNumber ? "input-error" : ""}`}
                placeholder="Enter Health Care Number"
                value={form.healthCareNumber}
                onChange={handleChange}
                onBlur={handleBlur}
                maxLength="14"
              />
              {errors.healthCareNumber && (
                <p className="error">{errors.healthCareNumber}</p>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                className={`field ${errors.email ? "input-error" : ""}`}
                placeholder="Enter Email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              {errors.email && <p className="error">{errors.email}</p>}
            </div>

            <div>
              <button type="submit">Generate OTP</button>
            </div>

            {successMessage && <p className="success">{successMessage}</p>}
            {errorMessage && <p className="error">{errorMessage}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;
