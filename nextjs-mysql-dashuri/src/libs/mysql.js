import mysql from 'serverless-mysql'

export const pool = mysql({
	config:{
		host: "localhost",
		port: 3306,
    user: "RGuti",
    password: "Pollito12",
    database: "dashuri"
	}
})