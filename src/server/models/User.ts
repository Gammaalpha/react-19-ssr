import { pool } from "../database/connection";
import bcrypt from "bcryptjs";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export interface User {
  id: number;
  email: string;
  password: string;
  refresh_token?: string;
  created_at: Date;
  updated_at: Date;
}

export class UserModel {
  static async create(email: string, password: string): Promise<User | null> {
    try {
      const hashedPassword = await bcrypt.hash(password, 12);
      const [result] = await pool.execute<ResultSetHeader>(
        "INSERT INTO users (email, password) VALUES (?, ?)",
        [email, hashedPassword]
      );

      const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM users WHERE id = ?",
        [result.insertId]
      );

      return rows[0] as User;
    } catch (error) {
      console.error("Error creating user:", error);
      return null;
    }
  }

  static async findByEmail(email: string): Promise<User | null> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM users WHERE email = ?",
        [email]
      );

      return (rows[0] as User) || null;
    } catch (error) {
      console.error("Error finding user by email:", error);
      return null;
    }
  }

  static async findById(id: number): Promise<User | null> {
    try {
      const [rows] = await pool.execute<RowDataPacket[]>(
        "SELECT * FROM users WHERE id = ?",
        [id]
      );

      return (rows[0] as User) || null;
    } catch (error) {
      console.error("Error finding user by id:", error);
      return null;
    }
  }

  static async updateRefreshToken(
    id: number,
    refreshToken: string
  ): Promise<boolean> {
    try {
      await pool.execute("UPDATE users SET refresh_token = ? WHERE id = ?", [
        refreshToken,
        id,
      ]);
      return true;
    } catch (error) {
      console.error("Error updating refresh token:", error);
      return false;
    }
  }

  static async validatePassword(
    plainPassword: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(plainPassword, hashedPassword);
  }
}
