const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../../middlewares/validar-campos");

const {
  cargarArchivo,
  actualizarImagen,
  mostrarImagen,
} = require("../../controllers/uploadController");

const router = Router();

router.post("/", cargarArchivo);

router.put("/:coleccion/:id", actualizarImagen);

router.get("/:coleccion/:id", mostrarImagen);

module.exports = router;
