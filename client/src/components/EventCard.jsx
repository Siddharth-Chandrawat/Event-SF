import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import '../index.css';

const EventCard = ({
  event,
  showOrganizer = false,
  onJoinClick = null,
}) => {
  const navigate = useNavigate();
  const handleClick = () => {
    navigate(`/events/${event.EVENT_ID}`);
  };

  return (
    <motion.div
      className="bg-white shadow-md rounded-lg p-6 border border-gray-200 cursor-pointer hover:shadow-lg transition-shadow duration-300"
      onClick={handleClick}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-start mb-2">
        <h2 className="text-lg font-semibold text-gray-800">{event.EVENT_TITLE}</h2>
        <span className="text-sm text-teal-500">
          {new Date(event.EVENT_START_DATE).toLocaleDateString()}
        </span>
      </div>

      {showOrganizer && (
        <p className="text-sm text-gray-600 mb-2">
          Organizer ID: {event.EVENT_ORGANISER_ID}
        </p>
      )}

      <p className="text-base text-gray-700 mb-4 whitespace-pre-line">
        {event.EVENT_DESCRIPTION || "No description provided."}
      </p>

      <div className="text-sm text-gray-600 space-y-1">
        <p>
          <span className="text-teal-500">🕒</span> {event.EVENT_START_TIME} – {event.EVENT_END_TIME}
        </p>
        <p>
          <span className="text-teal-500">📍</span> {event.EVENT_LOCATION || "Location not specified"}
        </p>
      </div>

      {onJoinClick && (
        <motion.button
          onClick={(e) => {
            e.stopPropagation();
            onJoinClick(event);
          }}
          className="mt-4 w-full bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-semibold hover:bg-indigo-700 transition duration-300"
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
        >
          Join Event
        </motion.button>
      )}
    </motion.div>
  );
};

export default EventCard;