import mariadb from 'mysql2/promise';
import dotenv from 'dotenv';
dotenv.config();

// db 연결 정보
const pool = mariadb.createPool({
  host: 'localhost',
  user: process.env.DB_USER,
  password : process.env.DB_PASSWORD,
  database: 'QuizChat',
  dateStrings : true
});

export default pool;