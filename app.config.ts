import sequelize from "./sequelize.config";
import express = require("express");
import bodyParser = require("body-parser");
import cors from "cors";
import { Routes } from "./src/routes/routes";

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.use("/api", new Routes().router);

const PORT = process.env.PORT || 3000;

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, () => {
      console.info(`Servidor Express escuchando en el puerto ${PORT}`);
    });
  })
  .catch((error: Error) => {
    console.error("Error al conectar y sincronizar la base de datos:", error);
  });
