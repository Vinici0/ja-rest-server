const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../../middlewares/validar-campos");
const { validateJWT } = require("../../middlewares/validar-jwt");

const { login, renewToken } = require("../../controllers/authController");

const router = Router();

router.post(
  "/login",
  [
    check("email", "El correo es obligatorio").isEmail(),
    check("password", "El password es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  login
);

router.get("/renew", validateJWT, renewToken);

module.exports = router;
