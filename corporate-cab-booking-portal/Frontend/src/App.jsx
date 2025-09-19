import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login.jsx";
import Home from "./pages/Home.jsx";

function App() {
  return (
    <Router>
      <Routes>
        {/* Vendor login */}
        <Route path="/" element={<Login />} />

        {/* Vendor’s company bookings */}
        <Route path="/bookings" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;

