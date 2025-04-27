import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById } from "../api/events";
import useAuth from "../hooks/useAuth.js"; 
import { postEventFeedback } from "../api/events";

const EventPage = () => {
  const { eventId } = useParams();
  const { user } = useAuth();
  console.log("User:", user);
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [feedbackText, setFeedbackText] = useState("");
  const [feedbackStatus, setFeedbackStatus] = useState(null);


  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const data = await getEventById(eventId);
        console.log(data);
        setEvent(data);
      } catch (err) {
        console.error(err);
        setError("Failed to load event.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [eventId]);

  if (loading) return <p>Loading event...</p>;
  if (error) return <p>{error}</p>;
  if (!event) return <p>No event found.</p>;

  const isParticipant = user?.role === "participant";
  const isOrganizer = user?.role === "organizer";

  const handleFeedbackSubmit = async () => {
    try {
      postEventFeedback(eventId, user.id,feedbackText); // send feedback to backend
      setFeedbackStatus({ type: "success", message: "Feedback submitted successfully!" });
      setFeedbackText(""); // clear textarea if you want
    } catch (error) {
      console.error(error);
      setFeedbackStatus({ type: "error", message: "Failed to submit feedback. Please try again." });
    }
  };
  

  return (
    <div className="mx-auto p-6 bg-white shadow  mt-6 ">
      <h1 className="text-3xl font-bold mb-2">{event.EVENT_TITLE}</h1>
      <p className="text-gray-600 mb-1">
        Date: {new Date(event.EVENT_START_DATE).toLocaleDateString()}
      </p>
      <p className="text-gray-600 mb-1">
        Time: {event.EVENT_START_TIME} – {event.EVENT_END_TIME}
      </p>
      <p className="text-gray-600 mb-4">
        Location: {event.EVENT_LOCATION || "Not specified"}
      </p>

      <p className="text-gray-800 whitespace-pre-line mb-4">
        {event.EVENT_DESCRIPTION || "No description provided."}
      </p>

      {isParticipant && (
        <button
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-xl mb-6"
          onClick={() => console.log(`event ${event.EVENT_ID} joined!`)}
        >
          Join Event
        </button>
      )}

      <hr className="my-4" />

      {/* Feedback Section Placeholder */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Feedback</h2>

        {/* Input box (participants only) */}
        {isParticipant && (
          <div className="mb-4">
            <textarea
              value = {feedbackText}
              onChange = {e=>setFeedbackText(e.target.value)}
              placeholder="Leave your feedback..."
              className="w-full p-3 border rounded-xl resize-none"
              rows={3}
            />
            <button 
              onClick={handleFeedbackSubmit}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl">
              Submit Feedback
            </button>
            {feedbackStatus && (
              <p className={`mt-2 ${feedbackStatus.type === "success" ? "text-green-600" : "text-red-600"}`}>
                {feedbackStatus.message}
              </p>
)}

          </div>
        )}

        {/* Feedback List will be added here */}
        <div className="space-y-3">
          {/* Later populated by fetched comments */}
          <p className="text-gray-500">No comments yet.</p>
        </div>
      </div>
    </div>
  );
};

export default EventPage;
