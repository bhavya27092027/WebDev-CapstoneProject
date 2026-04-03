import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Vendors from "./pages/Vendors.jsx";
import Register from "./pages/Register.jsx";

function App() {
  return (
    <Router>
      <Routes>
        
        {/* Register page */}
        <Route path="/register" element={<Register />} />

        {/* Login page */}
        <Route path="/login" element={<Login />} />

        {/* Company bookings */}
        <Route path="/bookings" element={<Home />} />

        {/* Vendor page */}
        <Route path="/vendors" element={<Vendors />} />
      </Routes>
    </Router>
  );
}

export default App;