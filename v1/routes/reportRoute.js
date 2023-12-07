const { Router } = require("express");
const { showMeasure,showMeter,showMeasureCourt,showCustomer,showCourt, showFine } = require("../../controllers/reportController");
const router = Router();

router.post("/pdf", showMeasure);
router.post("/pdf-meter", showMeter);
router.post("/pdf-court", showMeasureCourt);
router.post("/pdf-customer", showCustomer);
router.post("/pdf-court-all", showCourt);
router.get("/pdf-fine/:idCliente", showFine);

module.exports = router;