import { createPool } from 'mysql2/promise';

export const pool = createPool({
  host: "localhost",
  user: "root",
  password: "jksdjfk",
  database: "dashuri",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

/*
import mysql from 'serverless-mysql'

export const pool = mysql({
	config:{
		host: "localhost",
		port: 3306,
    user: "root",
    password: "bd1234",
    database: "dashuri"
	}
})

*/