import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import { AuthProvider } from "./contexts/AuthContext";
import {EventProvider} from "./contexts/EventContext.jsx"
import ProtectedRoute from "./components/ProtectedRoute";
import EventCreator from "./pages/CreateEvent.jsx"

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <EventProvider>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />

            {/* Home (currently accessible to all, we'll protect it later) */}
            <Route path="/home" element={<ProtectedRoute> <Home /> </ProtectedRoute>} />
            <Route path="/create" element={<ProtectedRoute> < EventCreator/> </ProtectedRoute>} />
          </Routes>
        </EventProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
