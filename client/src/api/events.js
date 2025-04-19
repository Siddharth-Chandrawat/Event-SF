import axiosInstance from "./axiosInstance";

export const getOrganizerEvents = async () => {
  return await axiosInstance.get("/events/organizer");
};

export const getParticipantEvents = async () => {
  return await axiosInstance.get("/events/participant/all");
};

export const getMyEvents = async () => {
  return await axiosInstance.get("/events/participant/myevents");
};

export const createNewEvent = async (eventData) => {
  return await axiosInstance.post("/events/create", eventData);
} 
