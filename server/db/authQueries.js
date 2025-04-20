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

export const registerUser = async (name, email, hashedPassword, role) => {
  const conn = await getConnection();
  try {
    await conn.execute(
      `INSERT INTO users (name, email, password, role) VALUES (:name, :email, :password, :role)`,
      [name, email, hashedPassword, role],
      { autoCommit: true }
    );
    return { success: true };
  } catch (err) {
    return { success: false, msg: err.message };
  } finally {
    await conn.close();
  }
};


export const updateUserDetails = async (id, name, email) => {
  const conn = await getConnection();
  try {
    const updates = [];
    const params = { id };

    if (name && name.trim()) {
      updates.push("name = :name");
      params.name = name.trim();
    }

    if (email && email.trim()) {
      updates.push("email = :email");
      params.email = email.trim();
    }

    const query = `
      UPDATE users
      SET ${updates.join(", ")}
      WHERE id = :id
      RETURNING id, name, email, role
      INTO :id_out, :name_out, :email_out, :role_out
    `;

    const binds = {
      ...params,
      id_out: { dir: OracleDB.BIND_OUT, type: OracleDB.NUMBER },
      name_out: { dir: OracleDB.BIND_OUT, type: OracleDB.STRING },
      email_out: { dir: OracleDB.BIND_OUT, type: OracleDB.STRING },
      role_out: { dir: OracleDB.BIND_OUT, type: OracleDB.STRING },
    };

    const result = await conn.execute(query, binds, { autoCommit: true });

    return {
      id: (result.outBinds.id_out)[0],
      name: (result.outBinds.name_out)[0],
      email: (result.outBinds.email_out)[0],
      role: (result.outBinds.role_out)[0],
    };
  } finally {
    await conn.close();
  }
};
