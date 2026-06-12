import pool from "../db.js";

export const getPaises = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const result = await pool.query(
      `SELECT p.nombre, p.continente, p.poblacion, pp.pib_2019, pp.pib_2020
       FROM paises p
       LEFT JOIN paises_pib pp ON p.nombre = pp.nombre
       ORDER BY p.nombre
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    res.status(200).json({ ok: true, data: result.rows });
  } catch (error) {
    console.error("Error al obtener países:", error);
    res.status(500).json({ ok: false, message: "Error al obtener países" });
  }
};

export const crearPais = async (req, res) => {
  const { nombre, continente, poblacion, pib_2019, pib_2020 } = req.body;

  if (!nombre || !continente || poblacion === undefined || pib_2019 === undefined || pib_2020 === undefined) {
    return res.status(400).json({ ok: false, message: "Todos los campos son requeridos" });
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

    res.status(201).json({ ok: true, message: `País '${nombre}' agregado correctamente` });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al crear el país:", error);
    res.status(500).json({ ok: false, message: "Error al crear el país" });
  } finally {
    client.release();
  }
};

export const eliminarPais = async (req, res) => {
  const nombre = req.params.nombre.trim();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const check = await client.query("      SELECT nombre FROM paises WHERE nombre = $1",
      [nombre]
    );

    if (check.rowCount === 0) {
      await client.query("ROLLBACK");
      return res
        .status(404)
        .json({ ok: false, message: `País '${nombre}' no encontrado` });
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

    res.status(200).json({ ok: true, message: `País '${nombre}' eliminado correctamente` });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al eliminar el país:", error);
    res.status(500).json({ ok: false, message: "Error al eliminar el país" });
  } finally {
    client.release();
  }
};