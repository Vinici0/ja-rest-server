const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../../middlewares/validar-campos");

const {
  getAllClients,
  getClientById,
} = require("../../controllers/customerController");

const router = Router();

router.get("/", getAllClients);
router.get("/:id", getClientById);

module.exports = router;
