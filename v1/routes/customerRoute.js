const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../../middlewares/validar-campos");

const {
  getAllClients,
  getClientById,
  createClient,
  updateClient

} = require("../../controllers/customerController");

const router = Router();

router.get("/", getAllClients);
router.get("/:id", getClientById);
router.post("/", createClient);
router.put("/:id", updateClient);

module.exports = router;
