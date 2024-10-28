import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import '../src/assets/login.css'
import Home from "./Component/Home";
import Login from "./Component/Login";
import Register from "./Component/Register";
import ForgotPassword from "./Component/ForgotPassword";
import ResetPassword from "./Component/ResetPassword";
import DashBoard from "./Component/DashBoard";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgotpassword" element={<ForgotPassword />} />
          <Route path="/resetpassword" element={<ResetPassword />} />
          <Route path="/welcomepage" element={<DashBoard/>} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
