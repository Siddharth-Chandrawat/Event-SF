import { useEffect, useState } from "react";
import { useEventContext } from "../hooks/useEventContext.js";
import EventCard from "./EventCard";

const ParticipantDashboard = () => {
  const {
    fetchMyEvents,
    fetchParticipantEvents,
    myEvents,
    events,
    loading,
    error,
  } = useEventContext();

  const [activeTab, setActiveTab] = useState("my"); // "my" or "all"
  const [filter, setFilter] = useState({ date: "", month: "" });

  // Fetch events based on tab and filters
  useEffect(() => {
    if (activeTab === "my") {
      fetchMyEvents(filter);
    } else {
      fetchParticipantEvents(filter);
    }
  }, [activeTab, filter]);

  const handleTabSwitch = (tab) => setActiveTab(tab);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilter((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <div className="flex space-x-4 mb-4">
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "my"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => handleTabSwitch("my")}
        >
          My Events
        </button>
        <button
          className={`px-4 py-2 rounded-lg ${
            activeTab === "all"
              ? "bg-blue-600 text-white"
              : "bg-gray-200 text-gray-800"
          }`}
          onClick={() => handleTabSwitch("all")}
        >
          All Events
        </button>
      </div>

      {/* 🔍 Filter */}
      <div className="mb-4 flex space-x-2">
        <input
          type="date"
          name="date"
          value={filter.date}
          onChange={handleFilterChange}
          className="border px-2 py-1 rounded-lg"
        />
        <select
          name="month"
          value={filter.month}
          onChange={handleFilterChange}
          className="border px-2 py-1 rounded-lg"
        >
          <option value="">-- Filter by Month --</option>
          {[...Array(12)].map((_, idx) => (
            <option key={idx + 1} value={idx + 1}>
              {new Date(0, idx).toLocaleString("default", { month: "long" })}
            </option>
          ))}
        </select>
      </div>

      {/* 📄 Events */}
      {loading && <p>Loading events...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading &&
        (activeTab === "my" ? myEvents : events).map((event) => (
          <EventCard key={event.EVENT_ID} event={event} />
        ))}
    </div>
  );
};

export default ParticipantDashboard;
