const { Router } = require("express");
const { showMeasure,showMeter,showMeasureCourt } = require("../../controllers/reportController");
const router = Router();

router.post("/pdf", showMeasure);
router.post("/pdf-meter", showMeter);
router.post("/pdf-court", showMeasureCourt);

module.exports = router;