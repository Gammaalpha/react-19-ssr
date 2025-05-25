const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3006"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "password",
  database: process.env.DB_NAME || "myapp",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
};

export default dbConfig;
