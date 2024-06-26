SELECT DISTINCT c.nombre 
FROM Cliente c
INNER JOIN Inscripcion i ON c.id = i.idCliente
INNER JOIN Producto p ON i.idProducto = p.id
INNER JOIN Disponibilidad d ON p.id = d.idProducto
INNER JOIN Visitan v ON c.id = v.idCliente AND d.idSucursal = v.idSucursal
WHERE NOT EXISTS (
    SELECT 1
    FROM Disponibilidad d2
    WHERE d2.idProducto = p.id
    AND d2.idSucursal NOT IN (
        SELECT idSucursal
        FROM Visitan v2
        WHERE v2.idCliente = c.id
    )
);