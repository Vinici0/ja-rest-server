const { Router } = require("express");
const { check } = require("express-validator");

const { validarCampos } = require("../../middlewares/validar-campos");

const {
  createFineDetail,
  deleteFineDetail,
  getFinesDetails,
  togglePaymentStatus,
  updateFineDetail,
  getFineDetailById,
  calculateTotalAmount,
  getFineDetailsByIdClient
} = require("../../controllers/fineController");

const router = Router();

router.get("/", getFinesDetails);

router.get("/calculateTotalAmount", calculateTotalAmount);

router.post(
  "/",
  createFineDetail
);

router.put(
  "/:id",
  [
    check("id_cliente", "El id del cliente es obligatorio").not().isEmpty(),
    check("id_multa", "El id de la multa es obligatorio").not().isEmpty(),
    validarCampos,
  ],
  updateFineDetail
);

router.put("/:id/paymentStatus", togglePaymentStatus);

router.delete("/:id", deleteFineDetail);

router.get("/:id", getFineDetailById);

router.get("/client/:id", getFineDetailsByIdClient);


module.exports = router;
