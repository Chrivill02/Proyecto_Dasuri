import mysql from 'serverless-mysql'

export const pool = mysql({
	config:{
		host: "localhost",
		port: 3307,
    user: "root",
    password: "",
    database: "dashuri"
	}
})