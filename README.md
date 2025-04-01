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


# PASO 4: Configurar variables de entorno ver que se encuentren en la ruta /Proyecto_Dasuri/nextjs-mysql-dashuri
#Recordar que los datos son los de ustedes!!
echo "DB_HOST=localhost" > .env.local
echo "DB_USER=root" >> .env.local
echo "DB_PASSWORD=tu_contraseña" >> .env.local
echo "DB_NAME=dashuri" >> .env.local
# PASO 5: Iniciar la aplicación
npm run dev

# La aplicación estará disponible en:
start http://localhost:3000