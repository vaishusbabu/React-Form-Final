import axios from 'axios';

const API_URL = 'http://localhost:8083/api/users'; 





export const forgotPassword = async (forgotPasswordRequest) => {
  try {
    const response = await axios.post(`${API_URL}/forgot-password`, forgotPasswordRequest);
    return response.data; 
  } catch (error) {
    throw error.response ? error.response.data : { message: "An error occurred" };
  }
};

// Reset password using OTP
export const resetPassword = async (resetPasswordRequest) => {
  try {
    const response = await axios.post(`${API_URL}/reset-password`, resetPasswordRequest);
    return response.data; 
  } catch (error) {
    throw error.response ? error.response.data : { message: "An error occurred" };
  }
};
