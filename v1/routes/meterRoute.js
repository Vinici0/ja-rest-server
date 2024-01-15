const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../../middlewares/validar-campos");

const { getMeter,updateMeterStatus } = require("../../controllers/meterController");

const router = Router();

router.get("/", getMeter);
router.put("/:id", updateMeterStatus);
module.exports = router;
