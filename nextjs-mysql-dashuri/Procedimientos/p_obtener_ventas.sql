DROP PROCEDURE IF EXISTS p_obtener_ventas;
DELIMITER //
CREATE PROCEDURE p_obtener_ventas(
    IN p_limit INT,
    IN p_offset INT
)
BEGIN
    SELECT 
        v.*, 
        u.nombre as usuario_nombre 
    FROM 
        venta v
    LEFT JOIN 
        usuario u ON v.usuario_id = u.id
    LIMIT 
        p_limit OFFSET p_offset;
END //
DELIMITER ;
