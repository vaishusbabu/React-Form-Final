import React from 'react'


function Header() {
  return (
    <div> 
  <ul>
    <div className="nav-left">
      <li><a href="/">Hospital Management System</a></li>
    </div>
    <div className="nav-right">
      <li><a href="/login">Login</a></li>
      <li><a href="/register">Registration</a></li>
    </div>
  </ul>
  </div>
  )
}

export default Header