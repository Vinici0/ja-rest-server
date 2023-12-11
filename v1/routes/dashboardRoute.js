const { Router } = require("express");
const { check } = require("express-validator");

// Agrar las funciones de los filtros del controlador
const { contClients, contUsers, contMeter, contReportMeter  } = require("../../controllers/dashboardController");

const router = Router();

// Agregar las rutas para los filtros
router.get("/numClients", contClients);
router.get("/numMeter", contMeter);
router.get("/numReportMeter", contReportMeter);
router.get("/numUsers", contUsers);

module.exports = router;