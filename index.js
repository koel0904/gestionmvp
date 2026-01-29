import express from "express";
import router from "./routes.js";

const app = express();

app.get("/", (req, res) => {
  res.send("Hello World From index.js");
});

app.use("/api", router);

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
