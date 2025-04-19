import  useAuth  from "../hooks/useAuth.js";
import OrganizerDashboard from "../components/OrganizerDashboard.jsx";
import ParticipantDashboard from "../components/ParticipantDashboard.jsx"

const Dashboard = () => {
  const { user } = useAuth();

  if (!user) return <p>Loading...</p>;

  return (
    <>
      {user.role === "organizer" ? (
        <OrganizerDashboard />
      ) : (
        <ParticipantDashboard />
      )}
    </>
  );
};

export default Dashboard;
