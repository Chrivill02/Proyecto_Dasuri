# Configuración del Proyecto Dashuri (Windows)

```bash
# PASO 1: Clonar repositorio
git clone git@github.com:Chrivill02/Proyecto_Dasuri.git 
#luego tienen que estar ubicados en la carpeta con este comando
cd nextjs-mysql-dashuri

# PASO 2: Instalar dependencias
npm install

# PASO 3: Importar base de datos MySQL
# Asegúrate de tener MySQL Server en ejecución
#Ejecuta esto en tu terminal que nos permite crear la base de datos que se va a usar
mysql -u root -p -e "CREATE DATABASE dashuri;"
#fijarse que se encuentren en la ruta /Proyecto_Dasuri/nextjs-mysql-dashuri y si se mira el path asi en su terminal ejecutar el comando:
mysql -u root -p dashuri < src/libs/dashuri.sql

# PASO 4: Configurar variables de entorno en el archivo libs -> src/libs archivo mysql.js
host:'localhost',//dejar de esta manera,
user: 'usuario',//su usuario de mysql
password: 'contrasenia',//la contraseña de su mysql
port: 3306,//el puerto donde lo estan corriendo
database: 'dashuri'//esto dejarlo asi

# PASO 5: Iniciar la aplicación
npm run dev

# La aplicación estará disponible en:
start http://localhost:3000