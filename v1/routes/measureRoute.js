const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../../middlewares/validar-campos");

const {
  execCorte,
  getMeasurements,
  getMeasurementsByMonthAndYear,
  updateMeasurement,
  updateMeasurementForAll,
  calculoIntrest,
  updateAllMeasurements,
  createMeusereAndUpdateCustomer,
  getMeasureById,
  updateMeauseAndCustomer,
  generaAndCalculo ,
  calculateAllAndUpdateMedidasAcumulado,
  updateDatosAlcantarilladoConSaldoPositivo,
  getCustomerInformation
} = require("../../controllers/measureController");

const router = Router();

router.get("/", getMeasurements);
router.get("/court", execCorte);
router.get("/monthAndYear", getMeasurementsByMonthAndYear);
router.put("/updateMeasurementForAll", updateMeasurementForAll);
router.post("/updateMeasurement", updateMeasurement);
router.put("/calculoIntrest", calculoIntrest);
router.put("/updateAllMeasurements", updateAllMeasurements);
router.post("/createMeusereAndUpdateCustomer", createMeusereAndUpdateCustomer);
router.get("/:id", getMeasureById);
router.put("/updateMeauseAndCustomer", updateMeauseAndCustomer);
router.post("/generaAndCalculo", generaAndCalculo);
router.put("/calculateAllAndUpdateMedidasAcumulado", calculateAllAndUpdateMedidasAcumulado);
router.put("/updateDatosAlcantarilladoConSaldoPositivo", updateDatosAlcantarilladoConSaldoPositivo);
router.get("/getCustomerInformation/:id", getCustomerInformation);


module.exports = router;
