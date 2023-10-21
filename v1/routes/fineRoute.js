const { Router } = require("express");
const { check } = require("express-validator");
const { validarCampos } = require("../../middlewares/validar-campos");

const {
  getFines,
  createFine,
  deleteFine,
  getFineById,
  updateFine,
} = require("../../controllers/fineController");

const router = Router();

router.get("/", getFines);

router.get("/:id", getFineById);

router.post(
  "/",
  [
    check("typeFine", "El tipo de multa es obligatorio").not().isEmpty(),
    check("cost", "El costo es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  createFine
);

router.put(
  "/:id",
  [
    check("typeFine", "El tipo de multa es obligatorio").not().isEmpty(),
    check("cost", "El costo es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  updateFine
);

router.delete("/:id", deleteFine);

module.exports = router;
