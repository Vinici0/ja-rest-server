const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../../middlewares/validar-campos");

const {
  getMeasurements,
  getMeasurementsByMonthAndYear,
  updateMeasurement,
  execCorte
} = require("../../controllers/measureController");

const router = Router();

router.get("/", getMeasurements);
router.get("/monthAndYear", getMeasurementsByMonthAndYear);
router.post("/", updateMeasurement);
router.get("/court", execCorte);
module.exports = router;
