const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../../middlewares/validar-campos");

const {
  getEmpresaById,
  updateEmpresa,
  getTabla,
  updateTabla,
  getInteres,
  updateInteres,
  getEmpresa,
  getClientPais,
  getClienteCiudad,
  getClienteTipoRuc,
  getClienteTipo,
} = require("../../controllers/configController");

const router = Router();

/* Empresa */
router.get("/empresa/:id", getEmpresaById);

router.get("/empresa", getEmpresa);

router.put(
  "/empresa/:id",

  updateEmpresa
);

/* Tabla */
router.get("/tabla", getTabla);

router.put(
  "/tabla/:id",
  [
    check("Desde", "Desde es obligatorio").not().isEmpty(),
    check("Hasta", "Hasta es obligatorio").not().isEmpty(),
    check("Basico", "Basico es obligatorio").not().isEmpty(),
    check("ValorExc", "ValorExc es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  updateTabla
);


/* Interes */
router.get("/interes", getInteres);

router.put(
  "/interes/:id",
  [
    check("interes", "El interes es obligatorio").not().isEmpty(),
    check("descripcion", "La descripción es obligatoria").not().isEmpty(),
    validarCampos,
  ],
  updateInteres
);

/* Pais */
router.get("/pais", getClientPais);

/* Ciudad */
router.get("/ciudad", getClienteCiudad);

/* Tipo Ruc */
router.get("/tipoRuc", getClienteTipoRuc);

/* Cliente Tipo */
router.get("/tipo", getClienteTipo);

module.exports = router;
