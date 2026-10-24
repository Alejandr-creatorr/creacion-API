import "dotenv/config";
import express from "express";
import { conectarDB } from "./config/db.js";
import autoresRoutes from "./routes/autores.routes.js";
import comicsRoutes from "./routes/comics.routes.js";

const app = express();

app.use(express.json());

// Sirve el cliente web (carpeta public/)
app.use(express.static("public"));

app.get("/api", (req, res) => {
  res.json({ mensaje: "API de la Tienda de Cómics funcionando" });
});

app.use("/api/autores", autoresRoutes);
app.use("/api/comics", comicsRoutes);

app.use((req, res) => {
  res.status(404).json({ mensaje: "Ruta no encontrada" });
});

const PORT = process.env.PORT || 3000;

conectarDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
  });
});
