import mysql from 'serverless-mysql'

export const pool = mysql({
	config:{
		host:'localhost',
		user: 'root',//su usuario de mysql
		password: 'fernando8923',//la contraseña de su mysql
		port: 3306,//el puerto donde lo estan corriendo
		database: 'dashuri'//esto dejarlo asi
	}
})
