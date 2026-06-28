# Pull request: Reuse global testPool and avoid import-time DB query

Este PR contiene los cambios para: 

- Reutilizar el pool de pruebas global (global.testPool) en tests de integración v1 y v2 para evitar condiciones de carrera entre workers de Jest.
- Eliminar la consulta ejecutada al importar el módulo de base de datos (src/db.js) que provocaba operaciones de BD en tiempo de importación.
- Añadir logs de debug para confirmar importación correcta de handlers V2 en los tests.

Detalles:
- Rama de trabajo: fix/tests-reuse-global-pool
- Cambios incluidos: 3 archivos modificados (tests/integration/v1/paises.test.js, tests/integration/v2/continente.test.js, src/db.js)

Por favor revisa los cambios y mergea cuando estés de acuerdo.
