const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../../middlewares/validar-campos");

const {
  getAllClients,
  getClientById,
  createClient,
} = require("../../controllers/customerController");

const router = Router();

router.get("/", getAllClients);
router.get("/:id", getClientById);
router.post("/", createClient);

module.exports = router;
