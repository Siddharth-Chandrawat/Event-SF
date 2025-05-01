import { createContext, useContext, useState } from "react";
import {
  getOrganizerEvents,
  getParticipantEvents,
  getMyEvents,
  createNewEvent,
} from "../api/events";

export const EventContext = createContext();

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [slotSuggestions, setSlotSuggestions] = useState([]); 

  // 🔵 Organizer: Fetch their own created events
  const fetchOrganizerEvents = async (filters = {}) => {
    try {
      setLoading(true);
      const res = await getOrganizerEvents(filters);
      setEvents(res.data);
      setError(null);
    } catch (err) {
      setError(err.message || "Failed to fetch organizer events");
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Participant: Fetch all public events
  const fetchParticipantEvents = async (filters = {}) => {
    try {
      setLoading(true);
      const res = await getParticipantEvents(filters);
      setEvents(res.data);
    } catch (err) {
      setError(err.message || "Failed to fetch participant events");
    } finally {
      setLoading(false);
    }
  };

  // 🟡 Participant: Fetch events they're registered in
  const fetchMyEvents = async (filters = {}) => {
    try {
      setLoading(true);
      const res = await getMyEvents(filters);
      setMyEvents(res.data);
    } catch (err) {
      setError(err.message || "Failed to fetch my events");
    } finally {
      setLoading(false);
    }
  };

  // 🔺 Organizer: Create new event
  const createEvent = async (eventData) => {
    try {
      setLoading(true);
      setError(null);
      setSlotSuggestions([]);

      const res = await createNewEvent(eventData);

      if (res.status === 201) {
        // Optionally append to events list:
        // setEvents(prev => [...prev, res.data]);
        return true;
      }
      // Unexpected non-201 status:
      setError("Unexpected response creating event");
      return false;
    } catch (err) {
      // 409 Conflict => slot unavailable
      if (err.response?.status === 409 && err.response.data?.suggestions) {
        setSlotSuggestions(err.response.data.suggestions);
        setError("Time slot unavailable—see suggestions below");
        return false;
      }
      // Other errors
      setError(err.message || "Failed to create event");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return (
    <EventContext.Provider
      value={{
        events,
        myEvents,
        fetchOrganizerEvents,
        fetchParticipantEvents,
        fetchMyEvents,
        createEvent,
        slotSuggestions,
        loading,
        error,
        setError,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => useContext(EventContext);
