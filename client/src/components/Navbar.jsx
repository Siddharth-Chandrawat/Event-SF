import { Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };
  return (
    <nav className="w-full bg-white shadow-md z-50">
      <div className="flex justify-between items-center p-4">
        {/* Left side: Home */}
        <div>
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Home
          </Link>
        </div>

        {/* Right side: Other links */}
        <ul className="flex space-x-4">
          <li>
            <Link
              to="/dashboard"
              className="inline-flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Create Event
            </Link>
          </li>
          <li>
            <Link
              to="/user"
              className="inline-flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
            >
              Profile
            </Link>
          </li>
          <li>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition cursor-pointer"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>
    </nav>
  );
}
