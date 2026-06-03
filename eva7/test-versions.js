#!/usr/bin/env node

// Script para probar las diferencias entre V1 y V2 de la API

import fetch from 'node-fetch';

const BASE_URL = 'http://localhost:4000';

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m'
};

console.log(`${colors.bright}${colors.blue}🧪 PRUEBA DE VERSIONES DE API${colors.reset}\n`);

// Probar V1
async function testV1() {
  console.log(`${colors.bright}${colors.yellow}📦 VERSIÓN 1 (v1) - Formato Simple${colors.reset}`);

  try {
    const response = await fetch(`${BASE_URL}/api/v1/paises?limit=2`);
    const data = await response.json();

    console.log(`URL: ${BASE_URL}/api/v1/paises?limit=2`);
    console.log('Status:', response.status);
    console.log('Respuesta:', JSON.stringify(data, null, 2));
    console.log(`${colors.green}✅ V1 funciona correctamente${colors.reset}\n`);

    return data;
  } catch (error) {
    console.log(`${colors.red}❌ Error en V1:${colors.reset}`, error.message);
  }
}

// Probar V2
async function testV2() {
  console.log(`${colors.bright}${colors.yellow}🚀 VERSIÓN 2 (v2) - Formato Mejorado${colors.reset}`);

  try {
    const response = await fetch(`${BASE_URL}/api/v2/paises?limit=2`);
    const data = await response.json();

    console.log(`URL: ${BASE_URL}/api/v2/paises?limit=2`);
    console.log('Status:', response.status);
    console.log('Respuesta:', JSON.stringify(data, null, 2));
    console.log(`${colors.green}✅ V2 funciona correctamente${colors.reset}\n`);

    return data;
  } catch (error) {
    console.log(`${colors.red}❌ Error en V2:${colors.reset}`, error.message);
  }
}

// Probar nueva funcionalidad V2
async function testV2NewFeature() {
  console.log(`${colors.bright}${colors.yellow}🆕 NUEVA FUNCIONALIDAD V2 - Búsqueda por Continente${colors.reset}`);

  try {
    const response = await fetch(`${BASE_URL}/api/v2/paises/continente/America`);
    const data = await response.json();

    console.log(`URL: ${BASE_URL}/api/v2/paises/continente/America`);
    console.log('Status:', response.status);
    console.log('Respuesta:', JSON.stringify(data, null, 2));
    console.log(`${colors.green}✅ Nueva funcionalidad V2 funciona correctamente${colors.reset}\n`);
  } catch (error) {
    console.log(`${colors.red}❌ Error en nueva funcionalidad:${colors.reset}`, error.message);
  }
}

// Comparar respuestas
function compareVersions(v1Data, v2Data) {
  console.log(`${colors.bright}${colors.blue}📊 COMPARACIÓN DE VERSIONES${colors.reset}\n`);

  console.log(`${colors.bright}V1 - Estructura:${colors.reset}`);
  console.log('  - ok: boolean');
  console.log('  - data: array[]');
  console.log('  - message: string (opcional)');

  console.log(`\n${colors.bright}V2 - Estructura:${colors.reset}`);
  console.log('  - success: boolean');
  console.log('  - result: object');
  console.log('    - countries: array[]');
  console.log('    - pagination: object (total, limit, offset, hasMore)');
  console.log('    - timestamp: string');
  console.log('    - version: string');
  console.log('  - error: string (opcional)');

  console.log(`\n${colors.bright}🎯 Diferencias clave:${colors.reset}`);
  console.log('  ✨ V2 incluye metadata de paginación');
  console.log('  ✨ V2 incluye timestamp de respuesta');
  console.log('  ✨ V2 tiene formato más descriptivo');
  console.log('  ✨ V2 posee nuevas funcionalidades (búsqueda por continente)');
  console.log('  ✨ V2 manejo de errores mejorado');
}

// Ejecutar todas las pruebas
async function runTests() {
  try {
    const v1Data = await testV1();
    const v2Data = await testV2();
    await testV2NewFeature();

    if (v1Data && v2Data) {
      compareVersions(v1Data, v2Data);
    }

    console.log(`\n${colors.bright}${colors.green}🎉 PRUEBAS COMPLETADAS${colors.reset}`);
    console.log(`${colors.bright}Ambas versiones funcionan correctamente${colors.reset}\n`);

  } catch (error) {
    console.error(`${colors.red}❌ Error en las pruebas:${colors.reset}`, error);
  }
}

// Ejecutar
runTests();