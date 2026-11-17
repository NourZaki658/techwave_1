
import { Routes, Route } from "react-router-dom";
import Home from "./home/Home";
import Navbar from "./home/Navbar";
import Dashboard from "./dashboard/Dashboard";
import Classes from "./classes/Classes";
import Auth from "./auth/Auth";

function App() {
  return (
    <>
      <Navbar />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/classes" element={<Classes />} />
        <Route path="/login" element={<Auth />} />
        <Route path="/register" element={<Auth />} />
      </Routes>
    </>
  );
}

export default App;
