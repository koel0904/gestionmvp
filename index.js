import express from "express";
import login from "./routes/login.js";
import register from "./routes/register.js";
import cookieParser from "cookie-parser";
import cors from "cors";

import locales from "./routes/locales.js";

const app = express();

app.use(
  cors({
    origin: ["http://localhost:5173", "http://localhost:5174"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json());

app.use(cookieParser());

app.get("/", (req, res) => {
  res.send("Hello World From index.js");
});

app.use("/api", login, register, locales);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
