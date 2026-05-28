import pg from "pg";
import { DB_CONFIG } from "./config.js";

const { Pool } = pg;

const pool = new Pool(DB_CONFIG);

pool.query('SELECT current_database()', (err, res) => {
    if (!err) console.log('🔥 Conectado a BD:', res.rows[0].current_database);                                 
  });     

// Test connection
pool.on("connect", () => {
  console.log("✓ Conectado a PostgreSQL");
});

pool.on("error", (err) => {
  console.error("Error en el pool de conexión:", err);
});

export const query = (text, params) => {
  return pool.query(text, params);
};

export default pool;