import { useEffect } from "react";
import { useEventContext } from "../hooks/useEventContext.js";
import EventCard from "../components/EventCard";

const OrganizerDashboard = () => {
  const { events, fetchOrganizerEvents, createEvent, loading, error } = useEventContext();

  useEffect(() => {
    fetchOrganizerEvents();
  }, []);

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-3xl font-bold text-gray-800">Organizer Dashboard</h1>

      {/* Loading/Error Handling */}
      {loading && <p className="text-blue-600">Loading events...</p>}
      {error && <p className="text-red-600">{error}</p>}

      {/* Event List */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Your Events</h2>
        {events.length === 0 ? (
          <p className="text-gray-500">No events created yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {events.map((event) => (
              <EventCard key={event.event_id} event={event} showOrganizer />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrganizerDashboard;
