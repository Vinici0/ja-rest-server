const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../../middlewares/validar-campos");

const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
} = require("../../controllers/userController");

const {
  validarJWT,
  varlidarADMIN_ROLE,
  varlidarADMIN_ROLE_o_MismoUsuario,
} = require("../../middlewares/validar-jwt");

const router = Router();

router.get("/", getUsers);

router.post(
  "/",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("password", "El password es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    validarCampos,
  ],
  createUser
);

router.put(
  "/:id",
  [
    validarJWT,
    varlidarADMIN_ROLE_o_MismoUsuario,
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("role", "El role es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  updateUser
);

router.delete("/:id", [validarJWT, varlidarADMIN_ROLE], deleteUser);

module.exports = router;
