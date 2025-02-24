import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import SignUp from "../pages/SignUp";
import MainPage from "../pages/MainPage";
import PrivateRoute from "./PrivateRoutes";
import LandingPage from "../pages/LandingPage";

function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<SignUp />} />

        {/* ✅ Protect /main using PrivateRoute */}
        <Route element={<PrivateRoute />}>
          <Route path="/main" element={<MainPage />} />
        </Route>

        <Route path="*" element={<LandingPage/>} />
      </Routes>
    </Router>
  );
}

export default AppRoutes;
