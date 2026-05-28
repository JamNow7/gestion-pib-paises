import express from "express";
import cors from "cors";
import { PORT } from "./config.js";
import paisesRoutes from "./routes/paises.routes.js";

const app = express();

app.use(cors({
  origin: "http://localhost:4200",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(paisesRoutes);

app.listen(PORT);
console.log(`Servidor escuchando en el puerto ${PORT}`);