const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../../middlewares/validar-campos");

const {
  execCorte,
  getMeasurements,
  getMeasurementsByMonthAndYear,
  updateMeasurement,
  updateMeasurementForAll,
  calculoIntrest
} = require("../../controllers/measureController");

const router = Router();

router.get("/", getMeasurements);
router.get("/court", execCorte);
router.get("/monthAndYear", getMeasurementsByMonthAndYear);
router.post("/updateMeasurement", updateMeasurement);
router.put("/updateMeasurementForAll", updateMeasurementForAll);
router.put("/calculoIntrest", calculoIntrest);

module.exports = router;
