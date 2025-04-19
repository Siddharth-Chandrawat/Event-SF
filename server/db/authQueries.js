import OracleDB from "oracledb";
import { getConnection } from "./db.js";
import { normalizeUser } from "../utils/auth.js";

export const getUserByEmail = async (email) => {
  const conn = await getConnection();
  try {
    const result = await conn.execute(
      `SELECT * FROM users WHERE email = :email`,
      [email],
      { outFormat: OracleDB.OUT_FORMAT_OBJECT }
    );
    return normalizeUser(result.rows[0]);
  } finally {
    await conn.close();
  }
};

export const registerUser = async (email, hashedPassword, role) => {
  const conn = await getConnection();
  try {
    await conn.execute(
      `INSERT INTO users (email, password, role) VALUES (:email, :password, :role)`,
      [email, hashedPassword, role],
      { autoCommit: true }
    );
    return { success: true };
  } catch (err) {
    return { success: false, msg: err.message };
  } finally {
    await conn.close();
  }
};
