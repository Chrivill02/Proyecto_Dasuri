CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_guardar_producto`(
  IN p_nombre VARCHAR(255),
  IN p_stock INT,
  IN p_precio DECIMAL(10,2),
  IN p_categoria_id INT,
  IN p_fecha_exp DATE
)
BEGIN
  DECLARE v_producto_id INT;
  DECLARE v_stock_actual INT;
  DECLARE v_precio_actual DECIMAL(10,2);
  DECLARE v_fecha_exp_actual DATE;


  SELECT id, stock, precio, fecha_exp
  INTO v_producto_id, v_stock_actual, v_precio_actual, v_fecha_exp_actual
  FROM producto
  WHERE nombre = p_nombre
  LIMIT 1;

  IF v_producto_id IS NOT NULL THEN

    SET @nuevo_stock = v_stock_actual + p_stock;
    SET @nuevo_precio = ((v_precio_actual * v_stock_actual) + (p_precio * p_stock)) / @nuevo_stock;
    SET @nueva_fecha = IF(p_fecha_exp > v_fecha_exp_actual, p_fecha_exp, v_fecha_exp_actual);

    UPDATE producto
    SET stock = @nuevo_stock,
        precio = @nuevo_precio,
        fecha_exp = @nueva_fecha
    WHERE id = v_producto_id;

  ELSE

    INSERT INTO producto (nombre, stock, precio, categoria_id, fecha_exp)
    VALUES (p_nombre, p_stock, p_precio, p_categoria_id, p_fecha_exp);
  END IF;
END