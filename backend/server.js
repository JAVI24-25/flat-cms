const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb" })); // para imágenes base64

app.use("/api/noticias", require("./routes/noticias.routes"));

app.listen(5000, () => {
  console.log("Servidor corriendo en puerto 5000");
});