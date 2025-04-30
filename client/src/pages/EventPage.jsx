import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getEventById } from "../api/events";
import useAuth from "../hooks/useAuth.js";
import { postEventFeedback, fetchEventFeedback } from "../api/events";
import { joinEvent } from "../api/events";
import io from 'socket.io-client';

const SOCKET_URL = 'http://localhost:8000';
const socket = io(SOCKET_URL);

const EventPage = () => {
  const { eventId } = useParams();
  const { user } = useAuth();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [feedbacks, setFeedbacks] = useState([]);
  const [loadingFb, setLoadingFeedback] = useState(true);
  const [errorFb, setFeedbackError] = useState(null);

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

    useEffect(() => {
      const fetchFeedbacks = async () => {
        try {
          const data = await fetchEventFeedback(eventId);
          setFeedbacks(data);
        } catch (err) {
          console.error(err);
          setFeedbackError("Failed to load feedback.");
        } finally {
          setLoadingFeedback(false);
        }
      };
    
      fetchFeedbacks();
    
      const handleNewFeedback = (feedbackData) => {
        //console.log('New feedback received from socket:', feedbackData);
        fetchFeedbacks();
      };
    
      socket.on('newFeedback', handleNewFeedback);
    
      return () => {
        socket.off('newFeedback', handleNewFeedback);
      };
    }, [eventId, socket]); // Include socket in the dependency array

  if (loading) return <p>Loading event...</p>;
  if (error) return <p>{error}</p>;
  if (!event) return <p>No event found.</p>;

  const isParticipant = user?.role === "participant";
  const isOrganizer = user?.role === "organizer";

  const handleFeedbackSubmit = async () => {
    try {
      const response = await postEventFeedback(eventId, user.id, feedbackText);
      setFeedbackStatus({ type: "success", message: "Feedback submitted successfully!" });
      setFeedbackText("");
      // The new feedback will be received via the socket and automatically added to the list
    } catch (error) {
      console.error(error);
      setFeedbackStatus({ type: "error", message: "Failed to submit feedback. Please try again." });
    }
  };

  const handleJoin = async () => {
    try {
      await joinEvent(eventId);
      alert("You've successfully joined this event!");
    } catch (err) {
      console.error("Join error:", err);
      if (err.response?.status === 409) {
        return alert(err.response.data.message);
      }
      alert("Could not join the event. Try again.");
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
          onClick={handleJoin}
        >
          Join Event
        </button>
      )}

      <hr className="my-4" />

      {/* Feedback Section */}
      <div>
        <h2 className="text-xl font-semibold mb-2">Feedback</h2>

        {/* Input box (participants only) */}
        {isParticipant && (
          <div className="mb-4">
            <textarea
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
              placeholder="Leave your feedback..."
              className="w-full p-3 border rounded-xl resize-none"
              rows={3}
            />
            <button
              onClick={handleFeedbackSubmit}
              className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl"
            >
              Submit Feedback
            </button>
            {feedbackStatus && (
              <p className={`mt-2 ${feedbackStatus.type === "success" ? "text-green-600" : "text-red-600"}`}>
                {feedbackStatus.message}
              </p>
            )}
          </div>
        )}

        <div className="space-y-4">
          {loadingFb ? (
            <p>Loading feedback…</p>
          ) : errorFb ? (
            <p className="text-red-500">{errorFb}</p>
          ) : feedbacks.length === 0 ? (
            <p className="text-gray-500">No comments yet.</p>
          ) : (
            feedbacks.map((fb, idx) => {
              const id = fb.FEEDBACK_ID ?? fb.id ?? idx;
              const userName = fb.USER_NAME ?? fb.user_name ?? fb.userName ?? "Unknown";
              const comment = fb.COMMENT_TEXT ?? fb.comment_text ?? fb.comment ?? "";
              const raw = fb.CREATED_AT ?? fb.created_at;
              const date = raw ? new Date(raw).toLocaleString() : "No timestamp";

              return (
                <div key={id} className="bg-gray-200 rounded-lg p-4 mb-4">
                  <p className="font-medium">{userName}</p>
                  <p className="text-gray-700">{comment}</p>
                  <p className="text-sm text-gray-500">{date}</p>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default EventPage;