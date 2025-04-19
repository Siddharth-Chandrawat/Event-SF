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
// queries/eventQueries.js



export const getAllEventsQuery = async (date, month) => {
  const conn = await getConnection();
  try {
    let query = `SELECT * FROM events`;
    let conditions = [];
    let params = {};

    if (date) {
      conditions.push(`TRUNC(event_start_date) = TO_DATE(:date, 'YYYY-MM-DD')`);
      params.date = date;
    } else if (month) {
      conditions.push(`EXTRACT(MONTH FROM event_start_date) = :month`);
      params.month = month;
    }

    if (conditions.length) {
      query += " WHERE " + conditions.join(" AND ");
    }

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

    if (date) {
      query += ` AND TRUNC(event_start_date) = TO_DATE(:date, 'YYYY-MM-DD')`;
      params.date = date;
    } else if (month) {
      query += ` AND EXTRACT(MONTH FROM event_start_date) = :month`;
      params.month = month;
    }

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
      JOIN event_participants ep ON e.event_id = ep.event_id
      WHERE ep.user_id = :participantId
    `;
    let params = { participantId };

    if (date) {
      query += ` AND TRUNC(e.event_start_date) = TO_DATE(:date, 'YYYY-MM-DD')`;
      params.date = date;
    } else if (month) {
      query += ` AND EXTRACT(MONTH FROM e.event_start_date) = :month`;
      params.month = month;
    }

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

