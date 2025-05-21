-- MySQL dump 10.13  Distrib 8.0.41, for Win64 (x86_64)
--
-- Host: localhost    Database: dashuri
-- ------------------------------------------------------
-- Server version	8.0.41

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `categoria_producto`
--

DROP TABLE IF EXISTS `categoria_producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categoria_producto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=3 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categoria_producto`
--

LOCK TABLES `categoria_producto` WRITE;
/*!40000 ALTER TABLE `categoria_producto` DISABLE KEYS */;
INSERT INTO `categoria_producto` VALUES (1,'Pelo'),(2,'Uñas');
/*!40000 ALTER TABLE `categoria_producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- -----------------------------------------------------
-- Tabla: cita_servicio
-- -----------------------------------------------------
DROP TABLE IF EXISTS `cita_servicio`;
CREATE TABLE `cita_servicio` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `fecha_cita` DATE NOT NULL,
  `hora_cita` TIME NOT NULL,
  `estado` VARCHAR(50) NOT NULL,
  `costo` DECIMAL(10,2) NOT NULL,
  `nombre_cliente` VARCHAR(100) NOT NULL,
  `telefono_cliente` VARCHAR(20) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- -----------------------------------------------------
-- Datos iniciales
-- -----------------------------------------------------
LOCK TABLES `cita_servicio` WRITE;
/*!40000 ALTER TABLE `cita_servicio` DISABLE KEYS */;
INSERT INTO `cita_servicio` (`id`, `fecha_cita`, `hora_cita`, `estado`, `costo`, `nombre_cliente`, `telefono_cliente`) VALUES
(4,'2025-05-23','11:01:00','Pendiente',400.00,'Mauri','2312'),
(5,'2025-05-07','10:30:00','Confirmada',222.00,'Chris','12341'),
(6,'2025-05-15','10:30:00','Confirmada',222.00,'Chrisa','12341');
/*!40000 ALTER TABLE `cita_servicio` ENABLE KEYS */;
UNLOCK TABLES;

-- -----------------------------------------------------
-- Procedimientos almacenados
-- -----------------------------------------------------

-- Obtener todas las citas
DROP PROCEDURE IF EXISTS obtener_citas;
DELIMITER //
CREATE PROCEDURE obtener_citas()
BEGIN
    SELECT * FROM cita_servicio;
END;
//
DELIMITER ;

-- Crear nueva cita
DROP PROCEDURE IF EXISTS crear_cita;
DELIMITER //
CREATE PROCEDURE crear_cita(
    IN p_fecha DATE,
    IN p_hora TIME,
    IN p_estado VARCHAR(50),
    IN p_costo DECIMAL(10,2),
    IN p_nombre_cliente VARCHAR(100),
    IN p_telefono_cliente VARCHAR(20)
)
BEGIN
    INSERT INTO cita_servicio (fecha_cita, hora_cita, estado, costo, nombre_cliente, telefono_cliente)
    VALUES (p_fecha, p_hora, p_estado, p_costo, p_nombre_cliente, p_telefono_cliente);
END;
//
DELIMITER ;

-- Actualizar cita existente
DROP PROCEDURE IF EXISTS actualizar_cita;
DELIMITER //
CREATE PROCEDURE actualizar_cita(
    IN p_id INT,
    IN p_fecha DATE,
    IN p_hora TIME,
    IN p_estado VARCHAR(50),
    IN p_costo DECIMAL(10,2),
    IN p_nombre_cliente VARCHAR(100),
    IN p_telefono_cliente VARCHAR(20)
)
BEGIN
    UPDATE cita_servicio
    SET fecha_cita = p_fecha,
        hora_cita = p_hora,
        estado = p_estado,
        costo = p_costo,
        nombre_cliente = p_nombre_cliente,
        telefono_cliente = p_telefono_cliente
    WHERE id = p_id;
END;
//
DELIMITER ;

-- Eliminar cita
DROP PROCEDURE IF EXISTS eliminar_cita;
DELIMITER //
CREATE PROCEDURE eliminar_cita(IN p_id INT)
BEGIN
    DELETE FROM cita_servicio WHERE id = p_id;
END;
//
DELIMITER ;

--
-- Table structure for table `cita_servicio_detalle`
--

DROP TABLE IF EXISTS `cita_servicio_detalle`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `cita_servicio_detalle` (
  `cita_id` int NOT NULL,
  `servicio_id` int NOT NULL,
  PRIMARY KEY (`cita_id`,`servicio_id`),
  KEY `servicio_id` (`servicio_id`),
  CONSTRAINT `cita_servicio_detalle_ibfk_1` FOREIGN KEY (`cita_id`) REFERENCES `cita_servicio` (`id`) ON DELETE CASCADE,
  CONSTRAINT `cita_servicio_detalle_ibfk_2` FOREIGN KEY (`servicio_id`) REFERENCES `servicios` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `cita_servicio_detalle`
--

LOCK TABLES `cita_servicio_detalle` WRITE;
/*!40000 ALTER TABLE `cita_servicio_detalle` DISABLE KEYS */;
/*!40000 ALTER TABLE `cita_servicio_detalle` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalles_compra`
--

DROP TABLE IF EXISTS `detalles_compra`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalles_compra` (
  `id` int NOT NULL AUTO_INCREMENT,
  `producto` varchar(150) NOT NULL,
  `producto_id` int NOT NULL,
  `cantidad` int NOT NULL,
  `proveedor_id` int NOT NULL,
  `fecha_vencimiento` datetime DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `proveedor_id` (`proveedor_id`),
  KEY `producto_id` (`producto_id`),
  CONSTRAINT `detalles_compra_ibfk_1` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedor` (`id`) ON DELETE CASCADE,
  CONSTRAINT `detalles_compra_ibfk_2` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalles_compra`
--

LOCK TABLES `detalles_compra` WRITE;
/*!40000 ALTER TABLE `detalles_compra` DISABLE KEYS */;
/*!40000 ALTER TABLE `detalles_compra` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `detalles_reserva_producto`
--

DROP TABLE IF EXISTS `detalles_reserva_producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `detalles_reserva_producto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `venta_id` int NOT NULL,
  `producto_id` int NOT NULL,
  `cantidad` int NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `estado` varchar(50) NOT NULL,
  PRIMARY KEY (`id`),
  KEY `venta_id` (`venta_id`),
  CONSTRAINT `detalles_reserva_producto_ibfk_1` FOREIGN KEY (`venta_id`) REFERENCES `venta` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `detalles_reserva_producto`
--

LOCK TABLES `detalles_reserva_producto` WRITE;
/*!40000 ALTER TABLE `detalles_reserva_producto` DISABLE KEYS */;
/*!40000 ALTER TABLE `detalles_reserva_producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto`
--

DROP TABLE IF EXISTS `producto`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `stock` int NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  `categoria_id` int NOT NULL,
  `fecha_exp` datetime DEFAULT NULL,
  `imagen_url` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`id`),
  KEY `categoria_id` (`categoria_id`),
  CONSTRAINT `producto_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categoria_producto` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto`
--

LOCK TABLES `producto` WRITE;
/*!40000 ALTER TABLE `producto` DISABLE KEYS */;
INSERT INTO `producto` VALUES (1,'Tinte de pelo',5,100.00,1,'2025-04-03 00:00:00','https://highxtar.com/wp-content/uploads/2023/01/thumb-tom-ford-beauty-2023.jpg'),(2,'prueba inge',234,234.20,2,'2025-07-26 00:00:00',NULL),(5,'Producto Mafer',1,1000.00,1,'2025-12-12 00:00:00','https://cdn.grupoelcorteingles.es/SGFM/dctm/MEDIA03/202002/03/00113516904599____1__967x1200.jpg?impolicy=Resize&width=967&height=1200');
/*!40000 ALTER TABLE `producto` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `producto_proveedor`
--

DROP TABLE IF EXISTS `producto_proveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `producto_proveedor` (
  `producto_id` int NOT NULL,
  `proveedor_id` int NOT NULL,
  PRIMARY KEY (`producto_id`,`proveedor_id`),
  KEY `proveedor_id` (`proveedor_id`),
  CONSTRAINT `producto_proveedor_ibfk_1` FOREIGN KEY (`producto_id`) REFERENCES `producto` (`id`) ON DELETE CASCADE,
  CONSTRAINT `producto_proveedor_ibfk_2` FOREIGN KEY (`proveedor_id`) REFERENCES `proveedor` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `producto_proveedor`
--

LOCK TABLES `producto_proveedor` WRITE;
/*!40000 ALTER TABLE `producto_proveedor` DISABLE KEYS */;
/*!40000 ALTER TABLE `producto_proveedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `proveedor`
--

DROP TABLE IF EXISTS `proveedor`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `proveedor` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `proveedor`
--

LOCK TABLES `proveedor` WRITE;
/*!40000 ALTER TABLE `proveedor` DISABLE KEYS */;
INSERT INTO `proveedor` VALUES (2,'fernnado inc','2341','fer@gmail.com');
/*!40000 ALTER TABLE `proveedor` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `registro_cliente`
--

DROP TABLE IF EXISTS `registro_cliente`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `registro_cliente` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `fecha_registro` timestamp NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `cliente_id` (`usuario_id`),
  CONSTRAINT `registro_cliente_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `registro_cliente`
--

LOCK TABLES `registro_cliente` WRITE;
/*!40000 ALTER TABLE `registro_cliente` DISABLE KEYS */;
/*!40000 ALTER TABLE `registro_cliente` ENABLE KEYS */;
UNLOCK TABLES;

-- ----------------------------
-- Tabla: servicios
-- ----------------------------
DROP TABLE IF EXISTS `servicios`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;

CREATE TABLE `servicios` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre_servicio` varchar(100) NOT NULL,
  `precio` decimal(10,2) NOT NULL,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

/*!40101 SET character_set_client = @saved_cs_client */;

-- ----------------------------
-- Datos iniciales de servicios
-- ----------------------------
LOCK TABLES `servicios` WRITE;
/*!40000 ALTER TABLE `servicios` DISABLE KEYS */;
INSERT INTO `servicios` VALUES 
(1,'Tinte a pelo',200.00),
(2,'Manicure',200.00),
(3,'Corte de pelo',120.00);
/*!40000 ALTER TABLE `servicios` ENABLE KEYS */;
UNLOCK TABLES;

-- ----------------------------
-- Procedimientos para servicios
-- ----------------------------
DELIMITER $$

CREATE PROCEDURE CrearServicio(
  IN p_nombre_servicio VARCHAR(100),
  IN p_precio DECIMAL(10,2)
)
BEGIN
  INSERT INTO servicios (nombre_servicio, precio)
  VALUES (p_nombre_servicio, p_precio);
END $$

CREATE PROCEDURE ObtenerServicios()
BEGIN
  SELECT * FROM servicios;
END $$

CREATE PROCEDURE ObtenerServicioPorId(
  IN p_id INT
)
BEGIN
  SELECT * FROM servicios WHERE id = p_id;
END $$

CREATE PROCEDURE ActualizarServicio(
  IN p_id INT,
  IN p_nombre_servicio VARCHAR(100),
  IN p_precio DECIMAL(10,2)
)
BEGIN
  UPDATE servicios
  SET nombre_servicio = p_nombre_servicio,
      precio = p_precio
  WHERE id = p_id;
END $$

CREATE PROCEDURE EliminarServicio(
  IN p_id INT
)
BEGIN
  DELETE FROM servicios WHERE id = p_id;
END $$

DELIMITER ;

-- Fin del script

LOCK TABLES `servicios` WRITE;
/*!40000 ALTER TABLE `servicios` DISABLE KEYS */;
INSERT INTO `servicios` VALUES (1,'Tinte a pelo',200.00),(2,'Manicure',200.00),(3,'Corte de pelo',120.00);
/*!40000 ALTER TABLE `servicios` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `usuario`
--

DROP TABLE IF EXISTS `usuario`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `usuario` (
  `id` int NOT NULL AUTO_INCREMENT,
  `nombre` varchar(100) NOT NULL,
  `telefono` varchar(20) DEFAULT NULL,
  `correo` varchar(100) NOT NULL,
  `contraseña` varchar(255) NOT NULL,
  `nivel` int DEFAULT NULL,
  PRIMARY KEY (`id`),
  UNIQUE KEY `correo` (`correo`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `usuario`
--

LOCK TABLES `usuario` WRITE;
/*!40000 ALTER TABLE `usuario` DISABLE KEYS */;
INSERT INTO `usuario` VALUES (1,'chris villegas','123','chris@gmail.com','$2b$10$pq6xJZfIc7FWbZiKTW9r3uU4hFG4Zr9ZVA7teYIwl.rwofatjNExG',0),(2,'admin','123','admin@gmail.com','$2b$10$K2AbTChZYOe9InxTHXCVN.QOiKF5sn4zTm1sCnv3yGJEqybQ3HouK',1),(3,'Ivan','43444444','ivanantoniodl@gmail.com','$2b$10$sO.xmWnHabeN26EuYJ/Qxe.XDC7oFAj3kDMmo1Oi07BY6V2097SjG',1),(4,'prueba','123','prueba@gmail.com','$2b$10$C4bafhRKjzvknJI25KkeFuKKoII0GoWBcDYQ475MgbMtIZmlzn03q',0);
/*!40000 ALTER TABLE `usuario` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `venta`
--

DROP TABLE IF EXISTS `venta`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `venta` (
  `id` int NOT NULL AUTO_INCREMENT,
  `usuario_id` int NOT NULL,
  `total` decimal(10,2) NOT NULL,
  `descripcion` text,
  PRIMARY KEY (`id`),
  KEY `cliente_id` (`usuario_id`),
  CONSTRAINT `venta_ibfk_1` FOREIGN KEY (`usuario_id`) REFERENCES `usuario` (`id`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `venta`
--

LOCK TABLES `venta` WRITE;
/*!40000 ALTER TABLE `venta` DISABLE KEYS */;
INSERT INTO `venta` VALUES (1,1,200.00,'Venta prueba 1');
/*!40000 ALTER TABLE `venta` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2025-05-07 18:22:58
