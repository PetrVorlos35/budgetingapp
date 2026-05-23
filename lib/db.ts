import mysql from 'mysql2/promise';

let connectionPool: mysql.Pool | undefined;

export const getDb = async () => {
  if (!connectionPool) {
    connectionPool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
      port: parseInt(process.env.DB_PORT || '3306', 10),
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });
  }
  return connectionPool;
};
