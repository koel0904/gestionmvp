import express from "express";
import login from "./routes/login.js";
import register from "./routes/register.js";
import cookieParser from "cookie-parser";
import cors from "cors";
// solo con importarlo se inicia el servidor de web sockets
import wss from "./ws.js";

import locales from "./routes/locales.js";
import tareas from "./routes/tareas.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World From index.js");
});

import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use("/api", login, register, locales, tareas);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
