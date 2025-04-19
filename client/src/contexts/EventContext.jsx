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

  // 🔵 Organizer: Fetch their own created events
  const fetchOrganizerEvents = async (filters = {}) => {
    try {
      setLoading(true);
      const res = await getOrganizerEvents(filters);
      setEvents(res.data);
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
      const res = await createNewEvent(eventData);
      //setEvents((prev) => [...prev, res.data]);
    } catch (err) {
      setError(err.message || "Failed to create event");
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
        loading,
        error,
      }}
    >
      {children}
    </EventContext.Provider>
  );
};

export const useEventContext = () => useContext(EventContext);
