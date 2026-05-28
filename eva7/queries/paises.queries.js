export const GET_ALL = `
  SELECT p.nombre, p.continente, p.poblacion,
         pp.pib_2019, pp.pib_2020
  FROM paises p
  LEFT JOIN paises_pib pp ON p.nombre = pp.nombre
  ORDER BY p.nombre
  LIMIT $1 OFFSET $2
`;

export const INSERT_PAIS = `
  INSERT INTO paises (nombre, continente, poblacion)
  VALUES ($1, $2, $3)
`;

export const INSERT_PIB = `
  INSERT INTO paises_pib (nombre, pib_2019, pib_2020)
  VALUES ($1, $2, $3)
`;

export const DELETE_PIB = `
  DELETE FROM paises_pib WHERE nombre = $1
`;

export const DELETE_PAIS = `
  DELETE FROM paises WHERE nombre = $1
`;

export const INSERT_DATA_WEB = `
  INSERT INTO paises_data_web (nombre_pais, accion)
  VALUES ($1, $2)
`;