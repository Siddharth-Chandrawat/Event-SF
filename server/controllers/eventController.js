import { createEventQuery, getAllEventsQuery, getOrganizerEventsQuery } from "../db/eventQueries.js";
import { fetchEventById } from "../db/eventQueries.js";
import { insertParticipation } from "../db/eventQueries.js";
import { getMyEventsQuery , deleteEventById } from "../db/eventQueries.js";
import IntervalTree from "../utils/intervalTree.js"; 

export const createEvent = async (req, res) => {
  const { title, description, location, start_date, start_time, end_time } = req.body;
  const organizer_id = req.user.id;
  if (!title || !start_date || !start_time || !end_time || !location) {
    return res.status(400).json({ msg: "Missing required fields" });
  }

  try {
    const existing = await getAllEventsQuery(start_date, null , location);
    // console.log("Existing events:", existing);
    const tree = new IntervalTree();
    const allIntervals = existing.map((evt => {
      const low = new Date(`${evt.start_date} ${evt.start_time}`).getTime();
      // console.log("Low:", low);
      const high = new Date(`${evt.start_date} ${evt.end_time}`).getTime();
      tree.insert({low , high });
      return {low , high };
    }));

    const reqLow = new Date(`${start_date} ${start_time}`).getTime();
    const reqHigh = new Date(`${start_date} ${end_time}`).getTime();
    const conflict = tree.searchAny({low: reqLow, high: reqHigh});

    if(!conflict) {
      // slot is free , create event
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
    }

    allIntervals.sort((a, b => a.low - b.low));
    const duration = reqHigh - reqLow;
    const suggestions = [];

    if(reqLow < allIntervals[0].low) {
      suggestions.push({
        start_time : new Date(reqLow).toISOString(),
        end_time: new Date(Math.min(reqLow + duration , allIntervals[0].low)).toISOString()
      });
    }

    for (let i = 0; i < allIntervals.length - 1; i++) {
      const gapStart = allIntervals[i].high;
      const fapEnd = allIntervals[i + 1].low;
      if(gapEnd - gapStart >= duration) {
        suggestions.push({
          start_time: new Date(gapStart).toISOString(),
          end_time: new Date(gapStart + duration).toISOString()
        });
        break;
      }
    }

    const last = allIntervals[allIntervals.length - 1];
    suggestions.push({
      start_time: new Date(last.high).toISOString(),
      end_time: new Date(last.high + duration).toISOString()
    });

    return res.status(409).json({ msg: "Time slot unavailable", suggestions });

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


export const getMyEvents = async (req, res) => {
  try {
    const userId = req.user?.id;
    const { date, month } = req.query;
    //console.log("Received filters:", { date, month });

    const events = await getMyEventsQuery(userId, date, month);

    //const actualMonth = date ? null : month;
    //const events = await getAllEventsQuery(date, actualMonth);

    res.json(events);
  } catch (error) {
    console.error("Error fetching all events:", error);
    res.status(500).json({ msg: "Failed to fetch events", error: error.message });
  }
};

export const getEventById = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await fetchEventById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    res.json(event);
  } catch (error) {
    console.error("Error fetching event:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const joinEvent = async (req, res) => {
  const userId  = req.user.id;                    // from verifyToken
  const eventId = parseInt(req.params.eventId, 10);

  try {
    await insertParticipation(userId, eventId);
    res.status(201).json({ message: "Joined event successfully." });
  } catch (error) {
    console.error("Join event error full:", JSON.stringify(error, null, 2));
  
    const isConflict = error.errorNum === 1 || error.code === "23505";
    if (isConflict) {
      return res.status(409).json({ message: "You have already joined this event." });
    }
  
    return res.status(500).json({ message: "Could not join event.", error: error.message });
  }  
};

export const deleteEvent = async (req, res) => {
  try {
    const eventId = parseInt(req.params.eventId, 10);
    const event = await fetchEventById(eventId);

    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    await deleteEventById(eventId);

    const io = req.io;
    if (io) {
      io.emit('eventDeleted', { eventId });
      console.log("One event was recently deleted :", eventId);
    } else {
      console.error("Socket.IO instance not available in event controller.");
    }
    
    return res.json({ message: "Event deleted successfully" });
  } catch (err) {
    console.error("Delete event error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};