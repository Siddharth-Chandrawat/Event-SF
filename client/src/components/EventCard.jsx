
const EventCard = ({
  event,
  showOrganizer = false,
  onJoinClick = null, // for participant dashboard, if needed
}) => {
  return (
    <div className="bg-white shadow-md rounded-2xl p-4 mb-4 border border-gray-200">
      <div className="flex justify-between items-start">
        <h3 className="text-xl font-bold text-gray-800">{event.EVENT_TITLE}</h3>
        <span className="text-sm text-gray-500">
          {new Date(event.EVENT_START_DATE).toLocaleDateString()}
        </span>
      </div>

      {showOrganizer && (
        <p className="text-sm text-gray-600 mt-1">
          Organizer ID: {event.EVENT_ORGANISER_ID}
        </p>
      )}

      <p className="text-gray-700 mt-2 whitespace-pre-line">
        {event.EVENT_DESCRIPTION || "No description provided."}
      </p>

      <div className="mt-4 text-sm text-gray-600">
        <p>
          🕒 {event.EVENT_START_TIME} – {event.EVENT_END_TIME}
        </p>
        <p>📍 {event.EVENT_LOCATION || "Location not specified"}</p>
      </div>

      {onJoinClick && (
        <button
          onClick={() => onJoinClick(event)}
          className="mt-4 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl"
        >
          Join Event
        </button>
      )}
    </div>
  );
};

export default EventCard;
