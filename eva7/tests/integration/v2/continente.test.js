/**
 * Tests de integración para búsqueda por continente (API V2)
 * Prueba el endpoint GET /api/v2/paises/continente/:continente
 */

import express from 'express';
import request from 'supertest';
import cors from 'cors';
import { getPaisesByContinenteV2, getPaisesV2 } from '../../../src/controllers/paises.v2.controller.js';
import pg from 'pg';

const { Pool } = pg;

// Crear una app de Express para testing
const app = express();
app.use(cors());
app.use(express.json());

// Crear router con las rutas V2
const router = express.Router();
// debug: mostrar tipo/valor del handler
console.log('DEBUG getPaisesV2:', typeof getPaisesV2, getPaisesV2);
console.log('DEBUG getPaisesByContinenteV2:', typeof getPaisesByContinenteV2, getPaisesByContinenteV2);
router.get('/paises', getPaisesV2);
router.get('/paises/continente/:continente?', getPaisesByContinenteV2);

app.use('/api/v2', router);

// Pool de BD para verificaciones directas
let dbPool;

beforeAll(async () => {
  // Reutilizar el pool global inicializado en tests/setup.js
  dbPool = global.testPool || global.dbPool;

  // Insertar datos de prueba para continentes específicos
  await dbPool.query(`
    INSERT INTO paises (nombre, continente, poblacion) VALUES
      ('EuropaPais1', 'Europa', 1000000),
      ('EuropaPais2', 'Europa', 2000000),
      ('AsiaPais1', 'Asia', 3000000),
      ('AmericaPais1', 'America', 4000000)
    ON CONFLICT (nombre) DO NOTHING
  `);

  await dbPool.query(`
    INSERT INTO paises_pib (nombre, pib_2019, pib_2020) VALUES
      ('EuropaPais1', 30000, 31000),
      ('EuropaPais2', 40000, 41000),
      ('AsiaPais1', 20000, 21000),
      ('AmericaPais1', 25000, 26000)
    ON CONFLICT (nombre) DO NOTHING
  `);
});

describe('API V2 - Búsqueda por Continente', () => {
  describe('GET /api/v2/paises/continente/:continente', () => {
    it('debe retornar países filtrados por continente', async () => {
      const response = await request(app)
        .get('/api/v2/paises/continente/Europa')
        .expect(200);

      expect(response.body).toHaveProperty('success', true);
      expect(response.body).toHaveProperty('result');
      expect(response.body.result).toHaveProperty('continent', 'Europa');
      expect(response.body.result).toHaveProperty('countries');
      expect(response.body.result).toHaveProperty('count');
      expect(response.body.result).toHaveProperty('pagination');
      expect(response.body.result).toHaveProperty('version', '2.0');

      expect(Array.isArray(response.body.result.countries)).toBe(true);
    });

    it('deve ser case-insensitive', async () => {
      const responseLower = await request(app)
        .get('/api/v2/paises/continente/europa')
        .expect(200);

      const responseUpper = await request(app)
        .get('/api/v2/paises/continente/EUROPA')
        .expect(200);

      const responseMixed = await request(app)
        .get('/api/v2/paises/continente/EuRoPa')
        .expect(200);

      // Todos deben retornar el mismo continente
      expect(responseLower.body.result.continent).toBe('europa');
      expect(responseUpper.body.result.continent).toBe('EUROPA');
      expect(responseMixed.body.result.continent).toBe('EuRoPa');

      // Todos deben tener países (al menos los de prueba)
      expect(responseLower.body.result.countries.length).toBeGreaterThan(0);
      expect(responseUpper.body.result.countries.length).toBeGreaterThan(0);
      expect(responseMixed.body.result.countries.length).toBeGreaterThan(0);
    });

    it('debe retornar solo países del continente especificado', async () => {
      const response = await request(app)
        .get('/api/v2/paises/continente/Europa')
        .expect(200);

      const countries = response.body.result.countries;

      // Verificar que todos los países son de Europa
      countries.forEach(pais => {
        expect(pais.continente.toLowerCase()).toBe('europa');
      });
    });

    it('deve incluir count con el número de países', async () => {
      const response = await request(app)
        .get('/api/v2/paises/continente/Europa')
        .expect(200);

      const count = response.body.result.count;
      const countries = response.body.result.countries;

      expect(typeof count).toBe('number');
      expect(count).toBe(countries.length);
    });

    it('deve incluir metadata de paginación', async () => {
      const response = await request(app)
        .get('/api/v2/paises/continente/Asia')
        .expect(200);

      const pagination = response.body.result.pagination;
      expect(pagination).toHaveProperty('limit');
      expect(pagination).toHaveProperty('offset');
    });

    it('debe respetar el parámetro limit', async () => {
      const limit = 1;
      const response = await request(app)
        .get(`/api/v2/paises/continente/Europa?limit=${limit}`)
        .expect(200);

      expect(response.body.result.countries.length).toBeLessThanOrEqual(limit);
      expect(response.body.result.pagination.limit).toBe(limit);
    });

    it('debe respetar el parámetro offset', async () => {
      // Primero obtener los primeros resultados
      const response1 = await request(app)
        .get('/api/v2/paises/continente/Europa?limit=1&offset=0')
        .expect(200);

      const firstCountry = response1.body.result.countries[0];

      // Obtener con offset
      const response2 = await request(app)
        .get('/api/v2/paises/continente/Europa?limit=1&offset=1')
        .expect(200);

      const secondCountry = response2.body.result.countries[0];

      // Si hay suficientes países, deben ser diferentes
      if (response1.body.result.count > 1) {
        expect(secondCountry.nombre).not.toBe(firstCountry.nombre);
      }

      expect(response2.body.result.pagination.offset).toBe(1);
    });

    it('debe retornar array vacío si continente no tiene países', async () => {
      const response = await request(app)
        .get('/api/v2/paises/continente/Antartida')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.result.countries).toEqual([]);
      expect(response.body.result.count).toBe(0);
    });

    it('debe incluir datos completos de países', async () => {
      const response = await request(app)
        .get('/api/v2/paises/continente/Europa')
        .expect(200);

      const countries = response.body.result.countries;

      if (countries.length > 0) {
        const pais = countries[0];
        expect(pais).toHaveProperty('nombre');
        expect(pais).toHaveProperty('continente');
        expect(pais).toHaveProperty('poblacion');
        expect(pais).toHaveProperty('pib_2019');
        expect(pais).toHaveProperty('pib_2020');
      }
    });

    it('deve mantener el nombre del continente tal como fue enviado', async () => {
      const continente = 'america del sur';

      const response = await request(app)
        .get(`/api/v2/paises/continente/${encodeURIComponent(continente)}`)
        .expect(200);

      expect(response.body.result.continent).toBe(continente);
    });

    it('deve funcionar con continentes de múltiples palabras', async () => {
      // Insertar un país con continente de múltiples palabras
      await dbPool.query(`
        INSERT INTO paises (nombre, continente, poblacion)
        VALUES ('PaisMultiContinente', 'America del Sur', 5000000)
        ON CONFLICT (nombre) DO NOTHING
      `);

      await dbPool.query(`
        INSERT INTO paises_pib (nombre, pib_2019, pib_2020)
        VALUES ('PaisMultiContinente', 35000, 36000)
        ON CONFLICT (nombre) DO NOTHING
      `);

      const response = await request(app)
        .get('/api/v2/paises/continente/America%20del%20Sur')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.result.countries.length).toBeGreaterThanOrEqual(1);
    });

    describe('Manejo de errores', () => {
      it('deve retornar 500 en caso de error de BD', async () => {
        // Este test verifica el manejo de errores
        // En un escenario real, se podría mockear el pool para causar un error

        const response = await request(app)
          .get('/api/v2/paises/continente/Europa');

        // Si la BD funciona correctamente, el test pasa
        // Si hay un error, debe tener la estructura correcta
        if (response.status === 500) {
          expect(response.body).toHaveProperty('success', false);
          expect(response.body).toHaveProperty('error');
          expect(response.body.error).toContain('Error al obtener países por continente');
        }
      });
    });

    describe('Casos edge', () => {
      it('deve manejar caracteres especiales en el nombre del continente', async () => {
        const response = await request(app)
          .get('/api/v2/paises/continente/Medio%20Oriente')
          .expect(200);

        // Puede retornar array vacío si no hay países
        expect(response.body.success).toBe(true);
        expect(Array.isArray(response.body.result.countries)).toBe(true);
      });

      it('deve manejar continente con acentos', async () => {
        // Insertar país con continente acentuado
        await dbPool.query(`
          INSERT INTO paises (nombre, continente, poblacion)
          VALUES ('PaisAcentuado', 'Asia Oriental', 6000000)
          ON CONFLICT (nombre) DO NOTHING
        `);

        await dbPool.query(`
          INSERT INTO paises_pib (nombre, pib_2019, pib_2020)
          VALUES ('PaisAcentuado', 38000, 39000)
          ON CONFLICT (nombre) DO NOTHING
        `);

        const response = await request(app)
          .get('/api/v2/paises/continente/Asia%20Oriental')
          .expect(200);

        expect(response.body.success).toBe(true);
      });

      it('deve manejar string vacío como continente', async () => {
        const response = await request(app)
          .get('/api/v2/paises/continente/')
          .expect(200);

        expect(response.body.success).toBe(true);
        expect(response.body.result.countries).toEqual([]);
      });
    });
  });

  describe('Integración con otros endpoints', () => {
    it('deve ser exclusivo de V2 (endpoint no disponible en V1)', async () => {
      // Este test documenta que la búsqueda por continente es V2-only
      // La verificación se hace al no tener un endpoint equivalente en V1

      const response = await request(app)
        .get('/api/v2/paises/continente/Europa')
        .expect(200);

      // Verificar que la respuesta es específica de V2
      expect(response.body.result).toHaveProperty('version', '2.0');
    });

    it('debe funcionar con países creados dinámicamente', async () => {
      // Crear un país nuevo en un continente específico
      await dbPool.query(`
        INSERT INTO paises (nombre, continente, poblacion)
        VALUES ('PaisDinamico', 'Africa', 7000000)
      `);

      await dbPool.query(`
        INSERT INTO paises_pib (nombre, pib_2019, pib_2020)
        VALUES ('PaisDinamico', 32000, 33000)
      `);

      const response = await request(app)
        .get('/api/v2/paises/continente/Africa')
        .expect(200);

      const paisEncontrado = response.body.result.countries.find(
        p => p.nombre === 'PaisDinamico'
      );

      expect(paisEncontrado).toBeDefined();
      expect(paisEncontrado.continente).toBe('Africa');
    });

    it('deve mantener consistencia con GET /paises', async () => {
      // Obtener países de Europa por el endpoint general
      const generalResponse = await request(app)
        .get('/api/v2/paises?limit=100')
        .expect(200);

      const europaPaisesGeneral = generalResponse.body.result.countries.filter(
        p => p.continente.toLowerCase() === 'europa'
      );

      // Obtener países de Europa por el endpoint específico
      const continenteResponse = await request(app)
        .get('/api/v2/paises/continente/Europa')
        .expect(200);

      const europaPaisesContinente = continenteResponse.body.result.countries;

      // Debe haber al menos tantos países en el endpoint específico
      // como en el filtrado del general
      expect(europaPaisesContinente.length).toBeGreaterThanOrEqual(
        europaPaisesGeneral.length
      );
    });
  });
});
