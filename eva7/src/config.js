import dotenv from 'dotenv';
dotenv.config();

export const DB_CONFIG = {
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_DATABASE || 'eva7',
};

export const PORT = process.env.PORT || 4000;