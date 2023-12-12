const { Router } = require("express");
const { check } = require("express-validator");

// Agrar las funciones de los filtros del controlador
const { 
    contClients, contUsers, contMeter, contReportMeter,
    listRoles,
    graficaUser_todos, graficaUser, graficaUserTodosFecha
} = require("../../controllers/dashboardController");

const router = Router();

// Agregar las rutas para los filtros
router.get("/numClients", contClients);
router.get("/numMeter", contMeter);
router.get("/numReportMeter", contReportMeter);
router.get("/numUsers", contUsers);

router.get("/listRoles", listRoles);

router.get("/graficaUserTodos", graficaUser_todos);
router.get("/graficaUser/:customRole", graficaUser);
router.get("/graficaUserTodosFecha/:fechIni/:fechFin", graficaUserTodosFecha);

module.exports = router;