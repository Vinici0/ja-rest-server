const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../../middlewares/validar-campos");

const { show } = require("../../controllers/reportController");

const router = Router();

router.post("/pdf", show);

module.exports = router;