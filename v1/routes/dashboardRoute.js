const { Router } = require("express");
const { check } = require("express-validator");

// Agrar las funciones de los filtros del controlador
const { 
    contClients, contUsers, contMeter, contReportMeter,
    listCiudad, listPais, listTipoCliente,
    listEstados, listCantidad, listLotes, listManzanas,
    listRoles,
    datosFiltradosClients,
    datosFiltradosMedidores,
    graficaUser_todos, graficaUser,
} = require("../../controllers/dashboardController");

const router = Router();

// Agregar las rutas para los filtros
router.get("/numClients", contClients);
router.get("/numMeter", contMeter);
router.get("/numReportMeter", contReportMeter);
router.get("/numUsers", contUsers);

router.get("/listEstados", listEstados);
router.get("/listCiudades", listCiudad);
router.get("/listPaises", listPais);
router.get("/listTipoCliente", listTipoCliente);

router.get("/listCantidades", listCantidad);
router.get("/listLotes", listLotes);
router.get("/listManzanas", listManzanas);

router.get("/listRoles", listRoles);

router.get('/datosFiltradosClientes/:idCiudad/:idPais/:idTipoCliente', datosFiltradosClients);
router.get('/datosFiltradosMedidores/:estado/:numMedidores/:lote/:manzana', datosFiltradosMedidores);

router.get("/graficaUserTodos", graficaUser_todos);
router.get("/graficaUser/:customRole", graficaUser);

module.exports = router;