const fs = require("fs");
const path = require("path");
const { v4: uuidv4 } = require("uuid");

const filePath = path.join(__dirname, "../data/noticias.json");

const getNoticias = (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  res.json(data);
};

const createNoticia = (req, res) => {
  const data = JSON.parse(fs.readFileSync(filePath));
  const { titulo, contenido, autor, imagen } = req.body;

  if (!titulo || !contenido || !autor || !imagen)
    return res.status(400).json({ msg: "Completa todos los campos" });

  const nueva = {
    id: uuidv4(),
    titulo,
    contenido,
    autor,
    fecha: new Date(),
    imagen
  };

  data.unshift(nueva); // insert al inicio
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  res.json(nueva);
};

const deleteNoticia = (req, res) => {
  let data = JSON.parse(fs.readFileSync(filePath));
  const { id } = req.params;

  data = data.filter(n => n.id !== id);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));

  res.json({ msg: "Eliminada" });
};

module.exports = { getNoticias, createNoticia, deleteNoticia };