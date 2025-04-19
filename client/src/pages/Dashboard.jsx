import  useAuth  from "../hooks/useAuth.js";
import OrganizerDashboard from "../components/OrganizerDashboard.jsx";

const ParticipantDashboard = () => {
  return (
    <p> ParticipantDashboard </p>
  )
}

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
