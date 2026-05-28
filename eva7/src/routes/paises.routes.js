import { Router } from "express";
import {
  getPaises,
  crearPais,
  eliminarPais,
} from "../controllers/paises.controller.js";

// Crea el router para las rutas de países.
const router = Router();

// Devuelve la lista de países por bloques.
router.get("/paises", getPaises);

// Inserta un nuevo país.
router.post("/paises", crearPais);

// Elimina un país usando el nombre como parámetro.
router.delete("/paises/:nombre", eliminarPais);

export default router;