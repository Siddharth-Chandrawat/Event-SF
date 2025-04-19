import Dashboard from "./Dashboard.jsx";
import useAuth from "../hooks/useAuth";
import Navbar from "../components/Navbar.jsx";

const Home = () => {
  const { user } = useAuth();

  return (
    <>
    <Navbar />
    <div className="max-w-lg mx-auto mt-20 px-4">
      {user ? (
        <div className="space-y-2">
          <p>
            <strong>Email:</strong> {user.email}
          </p>
          <p>
            <strong>Role:</strong> {user.role}
          </p>
          <Dashboard />
        </div>
      ) : (
        <p>Loading user data...</p>
      )}
    </div>
    </>
  );
};

export default Home;
