# Dashuri - Sistema Integral de Inventario y Citas

Dashuri es una plataforma Full-Stack escalable diseñada específicamente para el sector de belleza y cosmética. El sistema centraliza la gestión operativa del negocio, combinando un punto de venta (POS) para productos físicos, control avanzado de inventario y un motor de reservas para servicios y citas.

## Características Principales (Features)

* **Gestión de Agenda y Servicios:** Módulo de reservas dinámico que permite la creación de nuevas citas, administración de los servicios ofrecidos por el salón y control de disponibilidad de horarios.
* **Control de Inventario de Maquillaje:** CRUD completo para productos y categorías. Monitoreo de stock en tiempo real, registro de entradas/salidas y gestión de compras directas a proveedores.
* **Catálogo Digital:** Interfaz orientada al cliente para la visualización de productos disponibles filtrados por categoría.
* **Arquitectura de API REST:** Backend construido nativamente con Next.js API Routes, garantizando respuestas rápidas y una integración perfecta con el frontend.
* **Autenticación y Seguridad:** Sistema de login y registro para proteger rutas administrativas e información sensible del negocio.

## Tech Stack

**Frontend:**
![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

**Backend & API:**
![Node.js](https://img.shields.io/badge/Next_API_Routes-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
*(Nota: Añade aquí el badge de tu base de datos, ej: MySQL o PostgreSQL)*

## ⚙️ Instalación y Configuración Local

1. Clonar el repositorio:
   ```bash
   git clone [TU_URL_DEL_REPOSITORIO]

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
mysql -u root -p -e "CREATE DATABASE dashuri"
#fijarse que se encuentren en la ruta /Proyecto_Dasuri/nextjs-mysql-dashuri y si se mira el path asi en su terminal ejecutar el comando:

mysql -u root -p dashuri < src/libs/dashuri.sql
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