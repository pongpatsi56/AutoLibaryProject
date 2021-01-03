const express = require('express');
const router = express.Router();


const ReportDataControllers = require('../controllers/report');

/* get borrow and return data report */
router.post("/bnrreport", ReportDataControllers.borrowandreturn_datareport);

/* get notyet return data report  */
router.post("/notreturnreport", ReportDataControllers.notReturn_datareport);


module.exports = router;