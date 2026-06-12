import pool from "../db.js";

export const getPaisesV2 = async (req, res) => {
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

    const totalResult = await pool.query("SELECT COUNT(*) FROM paises");
    const total = parseInt(totalResult.rows[0].count);

    res.status(200).json({
      success: true,
      result: {
        countries: result.rows,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        },
        timestamp: new Date().toISOString(),
        version: "2.0"
      }
    });
  } catch (error) {
    console.error("Error al obtener países:", error);
    res.status(500).json({
      success: false,
      error: "Error interno del servidor",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

export const crearPaisV2 = async (req, res) => {
  const { nombre, continente, poblacion, pib_2019, pib_2020 } = req.body;

  if (!nombre || !continente || poblacion === undefined || pib_2019 === undefined || pib_2020 === undefined) {
    return res.status(400).json({
      success: false,
      error: "Todos los campos son requeridos",
      required_fields: ["nombre", "continente", "poblacion", "pib_2019", "pib_2020"]
    });
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

    res.status(201).json({
      success: true,
      message: `País '${nombre}' creado exitosamente`,
      result: {
        country: {
          nombre,
          continente,
          poblacion,
          pib_2019,
          pib_2020
        },
        created_at: new Date().toISOString(),
        version: "2.0"
      }
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al crear el país:", error);
    res.status(500).json({
      success: false,
      error: "Error al crear el país",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    client.release();
  }
};

export const eliminarPaisV2 = async (req, res) => {
  const nombre = req.params.nombre.trim();
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const check = await client.query(
      "SELECT nombre, continente, poblacion FROM paises WHERE nombre = $1",
      [nombre]
    );

    if (check.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        error: `País '${nombre}' no encontrado`
      });
    }

    const deletedCountry = check.rows[0];

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

    res.status(200).json({
      success: true,
      message: `País '${nombre}' eliminado correctamente`,
      result: {
        deleted_country: deletedCountry,
        deleted_at: new Date().toISOString(),
        version: "2.0"
      }
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error al eliminar el país:", error);
    res.status(500).json({
      success: false,
      error: "Error al eliminar el país",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  } finally {
    client.release();
  }
};

export const getPaisesByContinenteV2 = async (req, res) => {
  const { continente } = req.params;
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;

  try {
    const result = await pool.query(
      `SELECT p.nombre, p.continente, p.poblacion, pp.pib_2019, pp.pib_2020
       FROM paises p
       LEFT JOIN paises_pib pp ON p.nombre = pp.nombre
       WHERE LOWER(p.continente) = LOWER($1)
       ORDER BY p.nombre
       LIMIT $2 OFFSET $3`,
      [continente, limit, offset]
    );

    res.status(200).json({
      success: true,
      result: {
        continent: continente,
        countries: result.rows,
        count: result.rowCount,
        pagination: {
          limit,
          offset
        },
        version: "2.0"
      }
    });
  } catch (error) {
    console.error("Error al obtener países por continente:", error);
    res.status(500).json({
      success: false,
      error: "Error al obtener países por continente"
    });
  }
};