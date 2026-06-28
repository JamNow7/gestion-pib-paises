/**
 * Setup configuration for Jest tests
 * Configura la base de datos de pruebas y proporciona utilidades globales
 */

import pg from 'pg';
import dotenv from 'dotenv';

// Cargar variables de entorno
dotenv.config();

const { Pool } = pg;

// Configuración de BD de pruebas (usar solo variables TEST_DB_* para evitar contaminación del runner)
export const TEST_DB_CONFIG = {
  user: process.env.TEST_DB_USER ?? 'postgres',
  password: process.env.TEST_DB_PASSWORD ?? 'postgres',
  host: process.env.TEST_DB_HOST ?? process.env.DB_HOST ?? '127.0.0.1',
  port: process.env.TEST_DB_PORT ? Number(process.env.TEST_DB_PORT) : (process.env.DB_PORT ? Number(process.env.DB_PORT) : 5432),
  database: process.env.TEST_DB_DATABASE ?? 'eva7',
};

// Pool de conexiones para tests
export const testPool = new Pool(TEST_DB_CONFIG);

/**
 * Inicializa la base de datos de pruebas
 */
export async function setupTestDb() {
  try {
    await testPool.query('DROP TABLE IF EXISTS paises_pib CASCADE');
    await testPool.query('DROP TABLE IF EXISTS paises CASCADE');
    await testPool.query('DROP TABLE IF EXISTS paises_data_web CASCADE');

    await testPool.query(`
      CREATE TABLE paises (
        nombre VARCHAR(200) NOT NULL PRIMARY KEY,
        continente VARCHAR(200),
        poblacion INTEGER
      );

      CREATE TABLE paises_pib (
        nombre VARCHAR(200) NOT NULL PRIMARY KEY,
        pib_2019 INTEGER,
        pib_2020 INTEGER,
        CONSTRAINT fk_paises FOREIGN KEY (nombre)
          REFERENCES paises(nombre) ON DELETE CASCADE
      );

      CREATE TABLE paises_data_web (
        nombre_pais VARCHAR(200) NOT NULL PRIMARY KEY,
        accion INTEGER
      );

      INSERT INTO paises (nombre, continente, poblacion) VALUES
        ('TestCountry1', 'Europa', 1000000),
        ('TestCountry2', 'America', 2000000),
        ('TestCountry3', 'Asia', 3000000);

      INSERT INTO paises_pib (nombre, pib_2019, pib_2020) VALUES
        ('TestCountry1', 50000, 51000),
        ('TestCountry2', 30000, 31000),
        ('TestCountry3', 20000, 21000);

      INSERT INTO paises_data_web (nombre_pais, accion) VALUES
        ('TestCountry1', 1),
        ('TestCountry2', 1),
        ('TestCountry3', 1);
    `);

    console.log('✓ Tablas de pruebas creadas con datos iniciales');
  } catch (error) {
    console.error('Error al configurar BD de pruebas:', error);
    throw error;
  }
}

/**
 * Limpia todas las tablas después de cada test
 */
export async function cleanupTestDb() {
  try {
    // DROP y CREATE tablas para limpieza total
    await testPool.query('DROP TABLE IF EXISTS paises_pib CASCADE');
    await testPool.query('DROP TABLE IF EXISTS paises CASCADE');
    await testPool.query('DROP TABLE IF EXISTS paises_data_web CASCADE');

    await testPool.query(`
      CREATE TABLE paises (
        nombre VARCHAR(200) NOT NULL PRIMARY KEY,
        continente VARCHAR(200),
        poblacion INTEGER
      );

      CREATE TABLE paises_pib (
        nombre VARCHAR(200) NOT NULL PRIMARY KEY,
        pib_2019 INTEGER,
        pib_2020 INTEGER,
        CONSTRAINT fk_paises FOREIGN KEY (nombre)
          REFERENCES paises(nombre) ON DELETE CASCADE
      );

      CREATE TABLE paises_data_web (
        nombre_pais VARCHAR(200) NOT NULL PRIMARY KEY,
        accion INTEGER
      );

      INSERT INTO paises (nombre, continente, poblacion) VALUES
        ('TestCountry1', 'Europa', 1000000),
        ('TestCountry2', 'America', 2000000),
        ('TestCountry3', 'Asia', 3000000);

      INSERT INTO paises_pib (nombre, pib_2019, pib_2020) VALUES
        ('TestCountry1', 50000, 51000),
        ('TestCountry2', 30000, 31000),
        ('TestCountry3', 20000, 21000);

      INSERT INTO paises_data_web (nombre_pais, accion) VALUES
        ('TestCountry1', 1),
        ('TestCountry2', 1),
        ('TestCountry3', 1);
    `);
  } catch (error) {
    console.error('Error al limpiar BD de pruebas:', error);
    throw error;
  }
}

/**
 * Cierra la conexión a la BD de pruebas
 */
export async function teardownTestDb() {
  try {
    await testPool.end();
    console.log('✓ Conexión a BD de pruebas cerrada');
  } catch (error) {
    console.error('Error al cerrar BD de pruebas:', error);
    throw error;
  }
}

// Setup global antes de todos los tests
let setupDone = false;

beforeAll(async () => {
  if (!setupDone) {
    await setupTestDb();
    setupDone = true;
  }
});

// Cleanup después de cada test
afterEach(async () => {
  await cleanupTestDb();
});

// Teardown después de todos los tests
afterAll(async () => {
  // Solo cerrar el pool desde el worker principal de Jest para evitar
  // cerrar un pool que otros workers todavía están usando
  if (!process.env.JEST_WORKER_ID || process.env.JEST_WORKER_ID === '1') {
    await teardownTestDb();
  } else {
    console.log(`Worker ${process.env.JEST_WORKER_ID} skipping DB teardown`);
  }
});

// Hacer disponibles las funciones globalmente
global.testPool = testPool;
global.dbPool = testPool;  // alias esperado por los tests
global.TEST_DB_CONFIG = TEST_DB_CONFIG;
global.cleanupTestDb = cleanupTestDb;
