import { createEventQuery, getAllEventsQuery, getOrganizerEventsQuery, getParticipantEventsQuery} from "../db/eventQueries.js";

export const createEvent = async (req, res) => {
  const { title, description, location, start_date, start_time, end_time } = req.body;
  const organizer_id = req.user.id;

  if (!title || !start_date || !start_time || !end_time) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  try {
    const result = await createEventQuery({
      title,
      description, 
      location, 
      start_date, 
      start_time, 
      end_time,
      organizer_id,
    });

    if (!result.success) {
      return res.status(500).json({ msg: result.msg });
    }

    return res.status(201).json({ msg: "Event created successfully" });
  } catch (err) {
    console.error("Create event error:", err);
    return res.status(500).json({ msg: "Server error" });
  }
};


export const getOrganizerEvents = async (req, res) => {
  try {
    const id = req.user.id;
    const { date, month } = req.query;

    const events = await getOrganizerEventsQuery(id, date, month);
    //console.log(events);
    res.json(events);

  } catch (error) {
    console.error("Controller Error:", error.message);  // no circular issues here
    res.status(500).json({ msg: "Failed to fetch events" });
  }
};



export const getAllEvents = async (req, res) => {
  try {
    const { date, month } = req.query;
    console.log("Received filters:", { date, month });

    const events = await getAllEventsQuery(date, month);

    //const actualMonth = date ? null : month;
    //const events = await getAllEventsQuery(date, actualMonth);

    res.json(events);
  } catch (error) {
    console.error("Error fetching all events:", error);
    res.status(500).json({ msg: "Failed to fetch events", error: error.message });
  }
};


export const getParticipantEvents = async (req, res) => {
  try {
    const  id  = req.user.id;
    const { date, month } = req.query;

    const events = await getParticipantEventsQuery(id, date, month);
    res.json(events);
  } catch (error) {
    console.error("Error fetching participant's events:", error);
    res.status(500).json({ msg: "Failed to fetch events" });
  }
};
