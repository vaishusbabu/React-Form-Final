import React from 'react';


const Dashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div >
      <ul>
        <div className="nav-left">
          <li><a href="/">Hospital Management System</a></li>
        </div>
        <div className="nav-right">
          <li><a href="/">Home</a></li>
          <li><a href="/about">About</a></li>
          <li>
            <button onClick={() => {
              localStorage.removeItem('user'); 
              window.location.href = "/login";
            }}>
             {user?.patientFirstName}  Logout
            </button>
          </li>
        </div>
      </ul>

   <div >

<div className='main' >
  <h2>Profile</h2>
  <p><strong>Name :</strong> {user?.patientFirstName} {user?.patientLastName}</p>
  <p><strong>Health Care Number:</strong> {user?.healthCareNumber}</p>
  <p><strong>Email:</strong> {user?.email}</p>
  <p><strong>Sex:</strong> {user?.sex}</p>
  <p><strong>Family Doctor Name:</strong> {user?.familyDoctorFirstName}</p>
</div>
   </div>
    </div>
  );
};

export default Dashboard;
