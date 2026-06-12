import { Router } from "express";
import {
  getPaisesV2,
  crearPaisV2,
  eliminarPaisV2,
  getPaisesByContinenteV2
} from "../controllers/paises.v2.controller.js";

const router = Router();

router.get("/paises", getPaisesV2);
router.post("/paises", crearPaisV2);
router.delete("/paises/:nombre", eliminarPaisV2);

router.get("/paises/continente/:continente", getPaisesByContinenteV2);

export default router;