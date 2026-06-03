// Configuración de entorno para desarrollo
export const environment = {
  production: false,
  // URL del backend API para desarrollo
  apiUrl: 'http://localhost:4000',
  // Endpoint base para países (por defecto v1)
  apiEndpoint: '/api/v1/paises',
  // URL completa para facilitar uso
  fullApiUrl: 'http://localhost:4000/api/v1/paises',
  // Versión de la API por defecto
  apiVersion: 'v1',
  // Versiones disponibles
  availableVersions: ['v1', 'v2']
};
