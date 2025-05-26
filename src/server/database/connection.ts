import mysql from "mysql2/promise";
import dbConfig from "./config";

export const pool = mysql.createPool(dbConfig);

// Initialize database tables
export const initDatabase = async () => {
  try {
    await pool.execute(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        refresh_token TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `);
    console.log("Database tables initialized");
  } catch (error) {
    console.error("Database initialization error:", error);
  }
};

export const getConnection = () => {
  if (!pool) {
    throw new Error("Database connection has not been initialized");
  }
  return pool;
};
