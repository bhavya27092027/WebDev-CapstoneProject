import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";
import Vendors from "./pages/Vendors.jsx"; 

function App() {
  return (
    <Router>
      <Routes>
        {/* Login page */}
        <Route path="/" element={<Login />} />

        {/* Company bookings */}
        <Route path="/bookings" element={<Home />} />

        {/* Vendor page */}
        <Route path="/vendors" element={<Vendors />} />
      </Routes>
    </Router>
  );
}

export default App;
