import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./home/Home";
import Navbar from "./home/Navbar";
import Dashboard from "./dashboard/Dashboard";
import Classes from "./classes/Classes"; // Add this line
import Auth from "./auth/Auth"; // Add this at the top


// Inside <Routes>:
function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/classes" element={<Classes />} /> {/* Add this line */}
<Route path="/login" element={<Auth />} />
<Route path="/register" element={<Auth />} />
      </Routes>
    </Router>
  );
}

export default App;