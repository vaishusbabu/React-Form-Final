import React, { useState } from 'react';
import Header from './Header';
import axios from 'axios'; 

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    healthCareNumber: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.healthCareNumber) {
      newErrors.healthCareNumber = 'Health Care Number is required.';
    } else if (formData.healthCareNumber.length !== 14) {
      newErrors.healthCareNumber = 'Health Care Number must be 14 digits long.';
    }


    if (!formData.otp) {
      newErrors.otp = 'OTP is required.';
    } else if (!formData.otp.match(/^\d{6}$/)) {
      newErrors.otp = 'OTP must be a 6-digit number.';
    }

    if (!formData.newPassword) {
      newErrors.newPassword = 'New Password is required.';
    } else if (formData.newPassword.length < 8) {
      newErrors.newPassword = 'Password must contain at least 8 characters.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Confirm Password is required.';
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      try {
        const response = await axios.post('http://localhost:8083/api/users/reset-password', formData);
        
        setSuccessMessage(response.data.message || "Password reset successfully.");
        setErrorMessage('');
      
        setFormData({
          healthCareNumber: '',
          otp: '',
          newPassword: '',
          confirmPassword: ''
        });
        setErrors({});
      } catch (error) {
        const backendError = error.response?.data?.message || "An error occurred. Please try again.";
        
        if (backendError.includes("Healthcare number doesn't exist")) {
        
          setErrors({ ...errors, healthCareNumber: "The provided Healthcare Number doesn't exist." });
        } else if (backendError.includes("Invalid OTP")) {
          
          setErrors({ ...errors, otp: "The provided OTP is incorrect." });
        } else {
         
          setErrorMessage(backendError);
        }
        
        setSuccessMessage(''); 
      }
    }
  };
  

  return (
    <div>
      <Header />
      <form onSubmit={handleSubmit} className="main">
        <h2 className="heading">Reset Password</h2>

        <div className="form-group">
          <label htmlFor="healthCareNumber">Health Care Number:</label>
          <input
            type="text"
            id="healthCareNumber"
            name="healthCareNumber"
            value={formData.healthCareNumber}
            onChange={handleChange}
            className="field"
            placeholder="Enter Health Care Number"
          />
          {errors.healthCareNumber && (
            <div className="alert">{errors.healthCareNumber}</div>
          )}
        </div>
        
        <div className="form-group">
          <label htmlFor="otp">OTP:</label>
          <input
            type="text"
            id="otp"
            name="otp"
            value={formData.otp}
            onChange={handleChange}
            className="field"
            placeholder="ex: 123456"
          />
          {errors.otp && <div className="alert">{errors.otp}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="newPassword">New Password:</label>
          <input
            type="password"
            id="newPassword"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="field"
          />
          {errors.newPassword && <div className="alert">{errors.newPassword}</div>}
        </div>

        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password:</label>
          <input
            type="password"
            id="confirmPassword"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="field"
          />
          {errors.confirmPassword && (
            <div className="alert">{errors.confirmPassword}</div>
          )}
        </div>

        <div>
          <button type="submit">Reset Password</button>
        </div>

        {successMessage && <div className="alert success">{successMessage}</div>}
        {errorMessage && <div className="alert error">{errorMessage}</div>}
      </form>
    </div>
  );
};

export default ResetPassword;
