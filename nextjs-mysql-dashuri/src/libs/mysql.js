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
