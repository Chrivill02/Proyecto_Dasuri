import mysql from 'serverless-mysql'

export const pool = mysql({
	config:{
		host: "localhost",
		port: 3306,
    user: "root",
    password: "8905BD",
    database: "dashuri"
	}
})