import React, { useState, useEffect } from 'react';
import Header from './Header';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [formData, setFormData] = useState({
    registrationDate: '',
    registrationTime: '',
    email: '',
    password: '',
    streetAddress: '',
    streetAddressLine2: '',
    city: '',
    stateOrProvince: '',
    postalOrZipCode: '',
    maritalStatus: '',
    emergencyContactFirstName: '',
    emergencyContactLastName: '',
    emergencyContactRelationship: '',
    emergencyContactPhoneNumber: '',
    familyDoctorFirstName: '',
    familyDoctorLastName: '',
    familyDoctorPhoneNumber: '',
    preferredPharmacy: '',
    pharmacyPhoneNumber: '',
    reasonForRegistration: '',
    additionalNotes: '',
    insuranceCompany: '',
    insuranceID: '',
    policyHolderFirstName: '',
    policyHolderLastName: '',
    policyHolderDateOfBirth: '',
  });
  const navigate = useNavigate(); 
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false); 
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const now = new Date();
    setFormData(prevData => ({
      ...prevData,
      registrationDate: now.toISOString().substring(0, 10), 
      registrationTime: now.toISOString().substring(11, 16) 
    }));
  }, []); 

  const validate = () => {
    const newErrors = {};
  
    const requiredFields = [
      'patientFirstName', 'patientLastName', 'sex', 'birthMonth',
      'birthDay', 'birthYear', 'phoneNumber', 'email', 'password',
      'streetAddress', 'city', 'stateOrProvince', 'postalOrZipCode',
      'maritalStatus', 'emergencyContactFirstName', 'emergencyContactLastName',
      'emergencyContactRelationship', 'emergencyContactPhoneNumber',
      'familyDoctorFirstName', 'familyDoctorLastName', 'familyDoctorPhoneNumber',
      'preferredPharmacy', 'pharmacyPhoneNumber', 'reasonForRegistration',
      'insuranceCompany', 'insuranceID', 'policyHolderFirstName',
      'policyHolderLastName', 'policyHolderDateOfBirth'
    ];
  
    requiredFields.forEach(field => {
      if (!formData[field]) {
        newErrors[field] = `${field.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())} is required.`;
      }
    });

    const phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;
    if (!phoneRegex.test(formData.phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be in format (321) 654-0987";
    }
    
    const postalCodeRegex = /^\d{6}$/;
    if (!postalCodeRegex.test(formData.postalOrZipCode)) {
      newErrors.postalOrZipCode = "Postal code must consist of 6 digits";
    }
    
    const insuranceIDRegex = /^H\d{9}$/;
    if (!insuranceIDRegex.test(formData.insuranceID)) {
      newErrors.insuranceID = "Insurance ID must be in format H123456789";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address.";
    }

    if (!phoneRegex.test(formData.emergencyContactPhoneNumber)) {
      newErrors.emergencyContactPhoneNumber = "Emergency Contact Phone number must be in format (321) 654-0987";
    }
    if (!phoneRegex.test(formData.familyDoctorPhoneNumber)) {
      newErrors.familyDoctorPhoneNumber = "Family Doctor Phone number must be in format (321) 654-0987";
    }
    if (!phoneRegex.test(formData.pharmacyPhoneNumber)) {
      newErrors.pharmacyPhoneNumber = "Pharmacy Phone number must be in format (321) 654-0987";
    }
  
    if (formData.birthMonth < 1 || formData.birthMonth > 12) {
      newErrors.birthMonth = "Birth month must be between 1 and 12.";
    }
    if (formData.birthDay < 1 || formData.birthDay > 31) {
      newErrors.birthDay = "Birth day must be between 1 and 31.";
    }
    if (formData.birthYear < 1970 || formData.birthYear > 2024) {
      newErrors.birthYear = "Birth year must be between 1970 and 2024.";
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleBlur = (e) => {
    const { name, value } = e.target;
    validate(name, value);
  };
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    validate(name, value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:8083/api/users/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          setSuccess(true);
          toast.success("Registration successfully done!"); 
          navigate("/login"); 
          console.log("Form submitted successfully:", formData);
        } else {
          console.error("Form submission failed");
        }
      } catch (error) {
        console.error("Error occurred:", error);
      } finally {
        setLoading(false);
      }
    } else {
      console.log("Form has errors:", errors);
    }
  };


  return (
    <div>
      <Header />
      <div className="form-container">
        <form className="main" onSubmit={handleSubmit}>
          <h2 className="heading">Patient Registration Form</h2>
          {loading && <p>Submitting form...</p>}
          {success && <p className="success">Form submitted successfully!</p>}
          {Object.keys(errors).length > 0 && <p className="error">Please fix the errors above before submitting.</p>}

          <div className="row">
            <div className="col">
              <div className="form-group">
                <label htmlFor="registrationDate">Registration Date:</label>
                <input
                  type="date"
                  id="registrationDate"
                  name="registrationDate"
                  value={formData.registrationDate}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="field"
                  
                />
                {errors.registrationDate && <p className="error">{errors.registrationDate}</p>}
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label htmlFor="registrationTime">Time:</label>
                <input
                  type="time"
                  id="registrationTime"
                  name="registrationTime"
                  value={formData.registrationTime}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="field"
                  
                />
                {errors.registrationTime && <p className="error">{errors.registrationTime}</p>}
              </div>
            </div>
          </div>

         
          <div className="row">
            <div className="col">
              <div className="form-group">
                <label htmlFor="patientFirstName">Patient First Name:</label>
                <input
                  type="text"
                  id="patientFirstName"
                  name="patientFirstName"
                  value={formData.patientFirstName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="field"
                  
                />
                {errors.patientFirstName && <p className="error">{errors.patientFirstName}</p>}
              </div>
            </div>
            <div className="col">
              <div className="form-group">
                <label htmlFor="patientLastName">Patient Last Name:</label>
                <input
                  type="text"
                  id="patientLastName"
                  name="patientLastName"
                  value={formData.patientLastName}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className="field"
                  
                />
                {errors.patientLastName && <p className="error">{errors.patientLastName}</p>}
              </div>
            </div>
          </div>

          
          <div className="form-group">
            <label htmlFor="sex">Sex:</label>
            <select
              id="sex"
              name="sex"
              value={formData.sex}
              onChange={handleChange}
              className="field"
              onBlur={handleBlur}
            >
              <option value="" disabled>Select</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="N/A">N/A</option>
            </select>
            {errors.sex && <p className="error">{errors.sex}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="birthMonth">Birth Month:</label>
            <input
              type="number"
              id="birthMonth"
              name="birthMonth"
              min="1"
              max="12"
              value={formData.birthMonth}
              onChange={handleChange}
              className="field"
              onBlur={handleBlur}
            />
            {errors.birthMonth && <p className="error">{errors.birthMonth}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="birthDay">Birth Day:</label>
            <input
              type="number"
              id="birthDay"
              name="birthDay"
              min="1"
              max="31"
              value={formData.birthDay}
              onChange={handleChange}
              className="field"
              onBlur={handleBlur}
            />
            {errors.birthDay && <p className="error">{errors.birthDay}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="birthYear">Birth Year:</label>
            <input
              type="number"
              id="birthYear"
              name="birthYear"
              min="1900"
              max={new Date().getFullYear()}
              value={formData.birthYear}
              onChange={handleChange}
              className="field"
              onBlur={handleBlur}
            />
            {errors.birthYear && <p className="error">{errors.birthYear}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="phoneNumber">Phone Number:</label>
            <input
              type="tel"
              id="phoneNumber"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="field"
              placeholder="(321) 654-0987"
              onBlur={handleBlur}
            />
            {errors.phoneNumber && <p className="error">{errors.phoneNumber}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="field"
              onBlur={handleBlur}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="field"
              onBlur={handleBlur}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

       
          <div className="form-group">
            <label htmlFor="streetAddress">Street Address:</label>
            <input
              type="text"
              id="streetAddress"
              name="streetAddress"
              value={formData.streetAddress}
              onChange={handleChange}
              className="field"
              onBlur={handleBlur}
            />
            {errors.streetAddress && <p className="error">{errors.streetAddress}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="streetAddressLine2">Street Address Line 2:</label>
            <input
              type="text"
              id="streetAddressLine2"
              name="streetAddressLine2"
              value={formData.streetAddressLine2}
              onChange={handleChange}
              className="field"
              onBlur={handleBlur}
            />
          </div>

          <div className="form-group">
            <label htmlFor="city">City:</label>
            <input
              type="text"
              id="city"
              name="city"
              value={formData.city}
              onChange={handleChange}
              className="field"
              onBlur={handleBlur}
            />
            {errors.city && <p className="error">{errors.city}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="stateOrProvince">State/Province:</label>
            <input
              type="text"
              id="stateOrProvince"
              name="stateOrProvince"
              value={formData.stateOrProvince}
              onChange={handleChange}
              className="field"
              onBlur={handleBlur}
            />
            {errors.stateOrProvince && <p className="error">{errors.stateOrProvince}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="postalOrZipCode">Postal/Zip Code:</label>
            <input
              type="text"
              id="postalOrZipCode"
              name="postalOrZipCode"
              value={formData.postalOrZipCode}
              onChange={handleChange}
              className="field"
              onBlur={handleBlur}
            />
            {errors.postalOrZipCode && <p className="error">{errors.postalOrZipCode}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="maritalStatus">Marital Status:</label>
            <select
              id="maritalStatus"
              name="maritalStatus"
              value={formData.maritalStatus}
              onChange={handleChange}
              className="field"
              onBlur={handleBlur}
            >
              <option value="" disabled>Select</option>
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Divorced">Divorced</option>
              <option value="Widowed">Widowed</option>
              <option value="N/A">N/A</option>
            </select>
            {errors.maritalStatus && <p className="error">{errors.maritalStatus}</p>}
          </div>

       
          <h3>Emergency Contact Information</h3>
          <div className="form-group">
            <label htmlFor="emergencyContactFirstName">First Name:</label>
            <input
              type="text"
              id="emergencyContactFirstName"
              name="emergencyContactFirstName"
              value={formData.emergencyContactFirstName}
              onChange={handleChange}
              className="field"
              onBlur={handleBlur}
            />
            {errors.emergencyContactFirstName && <p className="error">{errors.emergencyContactFirstName}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="emergencyContactLastName">Last Name:</label>
            <input
              type="text"
              id="emergencyContactLastName"
              name="emergencyContactLastName"
              value={formData.emergencyContactLastName}
              onChange={handleChange}
              className="field"
              onBlur={handleBlur}
            />
            {errors.emergencyContactLastName && <p className="error">{errors.emergencyContactLastName}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="emergencyContactRelationship">Relationship:</label>
            <input
              type="text"
              id="emergencyContactRelationship"
              name="emergencyContactRelationship"
              value={formData.emergencyContactRelationship}
              onChange={handleChange}
              className="field"
              onBlur={handleBlur}
            />
            {errors.emergencyContactRelationship && <p className="error">{errors.emergencyContactRelationship}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="emergencyContactPhoneNumber">Phone Number:</label>
            <input
              type="tel"
              id="emergencyContactPhoneNumber"
              name="emergencyContactPhoneNumber"
              value={formData.emergencyContactPhoneNumber}
              onChange={handleChange}
              className="field"
              placeholder="(321) 654-0987"
              onBlur={handleBlur}
            />
            {errors.emergencyContactPhoneNumber && <p className="error">{errors.emergencyContactPhoneNumber}</p>}
          </div>

        
          <h3>Family Doctor Information</h3>
          <div className="form-group">
            <label htmlFor="familyDoctorFirstName">First Name:</label>
            <input
              type="text"
              id="familyDoctorFirstName"
              name="familyDoctorFirstName"
              value={formData.familyDoctorFirstName}
              onChange={handleChange}
              className="field"
              onBlur={handleBlur}
            />
            {errors.familyDoctorFirstName && <p className="error">{errors.familyDoctorFirstName}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="familyDoctorLastName">Last Name:</label>
            <input
              type="text"
              id="familyDoctorLastName"
              name="familyDoctorLastName"
              value={formData.familyDoctorLastName}
              onChange={handleChange}
              className="field"
              onBlur={handleBlur}
            />
            {errors.familyDoctorLastName && <p className="error">{errors.familyDoctorLastName}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="familyDoctorPhoneNumber">Phone Number:</label>
            <input
              type="tel"
              id="familyDoctorPhoneNumber"
              name="familyDoctorPhoneNumber"
              value={formData.familyDoctorPhoneNumber}
              onChange={handleChange}
              className="field"
              placeholder="(321) 654-0987"
              onBlur={handleBlur}
            />
            {errors.familyDoctorPhoneNumber && <p className="error">{errors.familyDoctorPhoneNumber}</p>}
          </div>

         
          <h3>Preferred Pharmacy Information</h3>
          <div className="form-group">
            <label htmlFor="preferredPharmacy">Pharmacy Name:</label>
            <input
              type="text"
              id="preferredPharmacy"
              name="preferredPharmacy"
              value={formData.preferredPharmacy}
              onChange={handleChange}
              className="field"
              onBlur={handleBlur}
              
            />
            {errors.preferredPharmacy && <p className="error">{errors.preferredPharmacy}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="pharmacyPhoneNumber">Phone Number:</label>
            <input
              type="tel"
              id="pharmacyPhoneNumber"
              name="pharmacyPhoneNumber"
              value={formData.pharmacyPhoneNumber}
              onChange={handleChange}
              className="field"
              placeholder="(321) 654-0987"
              onBlur={handleBlur}
            />
            {errors.pharmacyPhoneNumber && <p className="error">{errors.pharmacyPhoneNumber}</p>}
          </div>

         
          <div className="form-group">
            <label htmlFor="reasonForRegistration">Reason for Registration:</label>
            <input
              type="text"
              id="reasonForRegistration"
              name="reasonForRegistration"
              value={formData.reasonForRegistration}
              onChange={handleChange}
              className="field"
              onBlur={handleBlur}
            />
            {errors.reasonForRegistration && <p className="error">{errors.reasonForRegistration}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="additionalNotes">Additional Notes:</label>
            <textarea
              id="additionalNotes"
              name="additionalNotes"
              value={formData.additionalNotes}
              onChange={handleChange}
              className="field"
            />
          </div>

          <h3>Insurance Information</h3>
          <div className="form-group">
            <label htmlFor="insuranceCompany">Insurance Company:</label>
            <input
              type="text"
              id="insuranceCompany"
              name="insuranceCompany"
              value={formData.insuranceCompany}
              onChange={handleChange}
              className="field"
              onBlur={handleBlur}
            />
            {errors.insuranceCompany && <p className="error">{errors.insuranceCompany}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="insuranceID">Insurance ID:</label>
            <input
              type="text"
              id="insuranceID"
              name="insuranceID"
              value={formData.insuranceID}
              onChange={handleChange}
              className="field"
              onBlur={handleBlur}
            />
            {errors.insuranceID && <p className="error">{errors.insuranceID}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="policyHolderFirstName">Policy Holder First Name:</label>
            <input
              type="text"
              id="policyHolderFirstName"
              name="policyHolderFirstName"
              value={formData.policyHolderFirstName}
              onChange={handleChange}
              className="field"
              onBlur={handleBlur}
            />
            {errors.policyHolderFirstName && <p className="error">{errors.policyHolderFirstName}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="policyHolderLastName">Policy Holder Last Name:</label>
            <input
              type="text"
              id="policyHolderLastName"
              name="policyHolderLastName"
              value={formData.policyHolderLastName}
              onChange={handleChange}
              className="field"
              onBlur={handleBlur}
            />
            {errors.policyHolderLastName && <p className="error">{errors.policyHolderLastName}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="policyHolderDateOfBirth">Policy Holder Date of Birth:</label>
            <input
              type="date"
              id="policyHolderDateOfBirth"
              name="policyHolderDateOfBirth"
              value={formData.policyHolderDateOfBirth}
              onChange={handleChange}
              className="field"
              onBlur={handleBlur}
            />
            {errors.policyHolderDateOfBirth && <p className="error">{errors.policyHolderDateOfBirth}</p>}
          </div>

          <button type="submit" disabled={loading}>
            {loading ? 'Submitting...' : 'Submit'}
          </button>
        </form>
        <ToastContainer />
      </div>
    </div>
  );
}

export default Register;
