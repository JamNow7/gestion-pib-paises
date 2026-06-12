import express from "express";
import cors from "cors";
import { PORT } from "./config.js";
import paisesRoutes from "./routes/paises.routes.js";
import paisesRoutesV2 from "./routes/paises.v2.routes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:4200",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());

app.use("/api/v1", paisesRoutes);
app.use("/api/v2", paisesRoutesV2);

app.listen(PORT);
console.log(`API escuchando en http://localhost:${PORT}`);
console.log(`Endpoints disponibles:`);
console.log(`  v1: http://localhost:${PORT}/api/v1/paises`);
console.log(`  v2: http://localhost:${PORT}/api/v2/paises (nuevas funcionalidades)`);