const router = require("express").Router();
const controller = require("../controllers/noticias.controller");

router.get("/", controller.getNoticias);
router.post("/", controller.createNoticia);
router.delete("/:id", controller.deleteNoticia);

module.exports = router;