import { Router } from "express";
import { getPaises, crearPais, eliminarPais } from "../controllers/paises.controller.js";

const router = Router();

router.get("/paises", getPaises);
router.post("/paises", crearPais);
router.delete("/paises/:nombre", eliminarPais);

export default router;