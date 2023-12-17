const { Router } = require("express");
const { check } = require("express-validator");

// Agrar las funciones de los filtros del controlador
const { 
    listAnios, listLoteG, listManzanaG, getFilteredDataMedidas,
    contClients, contUsers, contMeter, contFade,
    listCiudad, listPais, listTipoCliente,
    listEstados, listCantidad, listLotes, listManzanas,
    listMultas, listPagado,
    listRoles,
    datosFiltradosClients,
    datosFiltradosMedidores,
    datosFiltradosMultas,
    graficaUser_todos, graficaUser, 
} = require("../../controllers/dashboardController");

const router = Router();

// Agregar las rutas para los filtros
router.get("/listAnios", listAnios);
router.get("/listLoteG", listLoteG);
router.get("/listManzanaG", listManzanaG);
router.get("/datosFiltradosMedidas/:nombre/:ruc/:anio/:mes/:lote/:manzana", getFilteredDataMedidas);

router.get("/numClients", contClients);
router.get("/numMeter", contMeter);
router.get("/numFade", contFade);
router.get("/numUsers", contUsers);

router.get("/listEstados", listEstados);
router.get("/listCiudades", listCiudad);
router.get("/listPaises", listPais);
router.get("/listTipoCliente", listTipoCliente);

router.get("/listCantidades", listCantidad);
router.get("/listLotes", listLotes);
router.get("/listManzanas", listManzanas);

router.get("/listMultas", listMultas);
router.get("/listPagado", listPagado);

router.get("/listRoles", listRoles);

router.get('/datosFiltradosClientes/:idCiudad/:idPais/:idTipoCliente', datosFiltradosClients);
router.get('/datosFiltradosMedidores/:estado/:numMedidores/:lote/:manzana', datosFiltradosMedidores);
router.get('/datosFiltradosMulta/:multa/:estado', datosFiltradosMultas);

router.get("/graficaUserTodos", graficaUser_todos);
router.get("/graficaUser/:customRole", graficaUser);

module.exports = router;