const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../../middlewares/validar-campos");

const {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  updateUserInfo,
} = require("../../controllers/userController");

const { validarJWT } = require("../../middlewares/validar-jwt");

const router = Router();

/* Validar JWT */
router.get("/", getUsers);

/* Validar JWT */
router.get("/:id", getUserById);

/* Validar JWT */
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

/* Validar JWT */
router.put(
  "/:id",
  [
    check("nombre", "El nombre es obligatorio").not().isEmpty(),
    check("email", "El email es obligatorio").isEmail(),
    check("role", "El role es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  updateUser
);

/* Validar JWT */
router.delete("/:id", deleteUser);

/* Validar JWT */
router.put(
  "/info/:idJaUsuario",
  [
    check("newName", "El nombre es obligatorio").not().isEmpty(),
    check("newEmail", "El email es obligatorio").isEmail(),
    validarCampos,
  ],
  updateUserInfo
);

module.exports = router;
