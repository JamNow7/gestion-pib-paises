import pool from "../db.js";

//GET Obtiene países paginados por limit y offset.
export const getPaises = async (req, res) => {
  // Lee parámetros de paginación; si no vienen, usa valores por defecto.
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  try {
    // Consulta países junto con su PIB usando JOIN.
    const result = await pool.query(
      `SELECT p.nombre, p.continente, p.poblacion, pp.pib_2019, pp.pib_2020
       FROM paises p
       LEFT JOIN paises_pib pp ON p.nombre = pp.nombre
       ORDER BY p.nombre
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    // Devuelve los registros encontrados.
    res.json(result.rows);
  } catch (error) {
    console.error("Error al obtener países:", error);
    res.status(500).json({ mensaje: "Error al obtener países" });
  }
};

//POST Inserta un país en paises, paises_pib y registra la acción en paises_data_web.
export const crearPais = async (req, res) => {
  const { nombre, continente, poblacion, pib_2019, pib_2020 } = req.body;

  if (
    !nombre ||
    !continente ||
    poblacion === undefined ||
    pib_2019 === undefined ||
    pib_2020 === undefined
  ) {
    return res.status(400).json({ mensaje: "Todos los campos son requeridos" });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    await client.query(
      "INSERT INTO paises (nombre, continente, poblacion) VALUES ($1, $2, $3)",
      [nombre, continente, poblacion]
    );

    await client.query(
      "INSERT INTO paises_pib (nombre, pib_2019, pib_2020) VALUES ($1, $2, $3)",
      [nombre, pib_2019, pib_2020]
    );

    await client.query(
      `INSERT INTO paises_data_web (nombre_pais, accion)
       VALUES ($1, $2)
       ON CONFLICT (nombre_pais)
       DO UPDATE SET accion = EXCLUDED.accion`,
      [nombre, 1]
    );

    await client.query("COMMIT");

    res.status(201).json({ mensaje: `País '${nombre}' agregado correctamente` });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al crear el país:", error);
    res.status(500).json({ mensaje: "Error al crear el país" });
  } finally {
    client.release();
  }
};

//DELETE Elimina un país por nombre y registra la acción en paises_data_web.
export const eliminarPais = async (req, res) => {
  const nombre = req.params.nombre.trim();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const check = await client.query(
      "SELECT nombre FROM paises WHERE nombre = $1",
      [nombre]
    );

    if (check.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ mensaje: `País '${nombre}' no encontrado` });
    }

    await client.query("DELETE FROM paises_pib WHERE nombre = $1", [nombre]);
    await client.query("DELETE FROM paises WHERE nombre = $1", [nombre]);

    await client.query(
      `INSERT INTO paises_data_web (nombre_pais, accion)
       VALUES ($1, $2)
       ON CONFLICT (nombre_pais)
       DO UPDATE SET accion = EXCLUDED.accion`,
      [nombre, 0]
    );

    await client.query("COMMIT");

    res.json({ mensaje: `País '${nombre}' eliminado correctamente` });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al eliminar el país:", error);
    res.status(500).json({ mensaje: "Error al eliminar el país" });
  } finally {
    client.release();
  }
};