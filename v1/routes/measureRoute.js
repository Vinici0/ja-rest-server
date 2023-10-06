const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../../middlewares/validar-campos");

const {
  getMeasurements,
  getMeasurementsByMonthAndYear,
  updateMeasurement,
} = require("../../controllers/measureController");

const router = Router();

router.get("/", getMeasurements);
router.get("/monthAndYear", getMeasurementsByMonthAndYear);
router.post("/", updateMeasurement);

router.post("/prueba", (req, res) => {
  const arregloDeObjetos = req.body; // Recupera el arreglo de objetos del cuerpo
  console.log(arregloDeObjetos);
  // Haz lo que necesites con el arreglo de objetos
  res.status(200).json({ mensaje: "Datos recibidos correctamente" });
});

module.exports = router;
