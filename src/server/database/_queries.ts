import { FieldPacket, ResultSetHeader } from "mysql2";
import { getConnection } from "./connection";

export const getAllUsers = async () => {
  try {
    const connection = getConnection();
    const [rows] = await connection.query("SELECT id, name, email FROM users");
    return rows;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
};

type UserRow = {
  id?: number;
  name: string;
  email: string;
  password?: string;
  insertId?: number;
};

export const getUserById = async (id: number): Promise<UserRow | null> => {
  try {
    const connection = getConnection();
    const [rows] = (await connection.query(
      "SELECT id, name, email FROM users WHERE id = ?",
      [id]
    )) as [UserRow[], any];
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error(`Error fetching user with id ${id}:`, error);
    throw error;
  }
};

export const getUserByEmail = async (
  email: string
): Promise<UserRow | null> => {
  try {
    const connection = getConnection();
    const [rows] = (await connection.query(
      "SELECT * FROM users WHERE email = ?",
      [email]
    )) as [UserRow[], any];
    return rows[0];
  } catch (error) {
    console.error(`Error fetching user with email ${email}:`, error);
    throw error;
  }
};

export const createUser = async (
  userData: UserRow
): Promise<UserRow | null> => {
  try {
    const connection = getConnection();
    const { name, email, password } = userData;

    const [result] = (await connection.query(
      "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
      [name, email, password]
    )) as [ResultSetHeader, FieldPacket[]];

    const userId = result.insertId;

    // Fetch the newly created user
    return await getUserById(userId);
  } catch (error) {
    console.error("Error creating user:", error);
    throw error;
  }
};
