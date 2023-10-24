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
} = require("../../controllers/configController");

const router = Router();

router.get("/empresa/:id", getEmpresaById);

router.get("/empresa", getEmpresa);

router.put(
  "/empresa/:id",

  updateEmpresa
);

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

module.exports = router;

/* 
    localhost:3000/api/config/empresa/1
    localhost:3000/api/config/tabla
    localhost:3000/api/config/interes
    localhost:3000/api/config/tabla/1
    localhost:3000/api/config/interes/1
*/
