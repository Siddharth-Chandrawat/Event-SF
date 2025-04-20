import { getConnection } from "./db.js";
import OracleDB from "oracledb";
import {readClob} from "../utils/event.js"

export const createEventQuery = async ({
  title,
  description,
  location,
  start_date,
  start_time,
  end_time,
  organizer_id,
}) => {
  const conn = await getConnection();
  try {
    await conn.execute(
      `INSERT INTO events (event_title, event_description, event_location, event_start_date, event_start_time, event_end_time, event_organizer_id)
       VALUES (:title, :description, :location, TO_DATE(:start_date, 'YYYY-MM-DD'), :start_time, :end_time, :organizer_id)`,
      {
        title,
        description,
        location,
        start_date,
        start_time,
        end_time,
        organizer_id,
      },
      { autoCommit: true }
    );
    return { success: true };
  } catch (err) {
    console.error("DB Error:", err);
    return { success: false, msg: err.message };
  } finally {
    await conn.close();
  }
};

export const fetchEventById = async (eventId) => {
  let connection;

  try {
    connection = await getConnection();

    const result = await connection.execute(
      `
      SELECT * FROM events
      WHERE event_id = :eventId
      `,
      [eventId],
      { outFormat: OracleDB.OUT_FORMAT_OBJECT, }
    );

    const rows = await Promise.all(
      result.rows.map(async (row) => {
        if (row.EVENT_DESCRIPTION && typeof row.EVENT_DESCRIPTION === "object") {
          row.EVENT_DESCRIPTION = await readClob(row.EVENT_DESCRIPTION);
        }
        return row;
      })
    );

    return rows[0] || null;
  } catch (err) {
    throw err;
  } finally {
    if (connection) {
      await connection.close();
    }
  }
};


export const getAllEventsQuery = async (date, month) => {
  const conn = await getConnection();
  try {
    
    let query = `SELECT * FROM events`;
    let params = {}; // Only include what is actually used

    //chal nahi rha with date, maybe params ke andar 'data' variable ka naam change karna
    //if (date !== '') {
    //  params.date = date; // pass as 'YYYY-MM-DD'
    //  query += ` WHERE TRUNC(event_start_date) = TO_DATE(:date, 'YYYY-MM-DD')`;
    //} else if (month !== '') {
    //  params.month = parseInt(month, 10);
    //  query += ` WHERE EXTRACT(MONTH FROM event_start_date) = :month`;
    //}

    //query += ` WHERE TRUNC(event_start_date) = TO_DATE('2025-04-23', 'YYYY-MM-DD')`;
    if (month !== '') {
      params.month = parseInt(month, 10);
      query += ` WHERE EXTRACT(MONTH FROM event_start_date) = :month`;
    }

    console.log("Query:", query);
    console.log("Params:", params);

    const result = await conn.execute(query, params, {
      outFormat: OracleDB.OUT_FORMAT_OBJECT,
    });

    const rows = await Promise.all(
      result.rows.map(async (row) => {
        if (row.EVENT_DESCRIPTION && typeof row.EVENT_DESCRIPTION === "object") {
          row.EVENT_DESCRIPTION = await readClob(row.EVENT_DESCRIPTION);
        }
        return row;
      })
    );

    return rows;
  } finally {
    await conn.close();
  }
};


export const getOrganizerEventsQuery = async (organizerId, date, month) => {
  const conn = await getConnection();
  try {
    let query = `SELECT * FROM events WHERE event_organizer_id = :organizerId`;
    let params = { organizerId };


    const result = await conn.execute(query, params, {
      outFormat: OracleDB.OUT_FORMAT_OBJECT,
    });

    const rows = await Promise.all(
      result.rows.map(async (row) => {
        if (row.EVENT_DESCRIPTION && typeof row.EVENT_DESCRIPTION === "object") {
          row.EVENT_DESCRIPTION = await readClob(row.EVENT_DESCRIPTION);
        }
        return row;
      })
    );

    return rows;
  } catch (err) {
    console.error("DB Query Error:", err.message);
    throw new Error("Failed to execute organizer event query");
  } finally {
    await conn.close();
  }
};



export const getParticipantEventsQuery = async (participantId, date, month) => {
  const conn = await getConnection();
  try {
    let query = `
      SELECT e.*
      FROM events e
      JOIN participants p ON e.event_id = p.participant_event_id
      WHERE p.participant_user_id = :participantId
    `;
    let params = { participantId };

    //if (date) {
    //  query += ` AND TRUNC(e.event_start_date) = TO_DATE(:date, 'YYYY-MM-DD')`;
    //  params.date = date;
    //} else if (month) {
    //  query += ` AND EXTRACT(MONTH FROM e.event_start_date) = :month`;
    //  params.month = month;
    //}

    if (month !== '') {
      params.month = parseInt(month, 10);
      query += ` WHERE EXTRACT(MONTH FROM event_start_date) = :month`;
    }

    console.log("Query:", query);
    console.log("Params:", params);

    const result = await conn.execute(query, params, {
      outFormat: OracleDB.OUT_FORMAT_OBJECT,
    });

    const rows = await Promise.all(
      result.rows.map(async (row) => {
        if (row.EVENT_DESCRIPTION && typeof row.EVENT_DESCRIPTION === "object") {
          row.EVENT_DESCRIPTION = await readClob(row.EVENT_DESCRIPTION);
        }
        return row;
      })
    );

    return rows;
  } finally {
    await conn.close();
  }
};


