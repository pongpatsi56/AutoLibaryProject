const express = require('express');
const router = express.Router();


const ReportDataControllers = require('../controllers/report');

/* รายงานข้อมูลการยืมสมาชิก */
router.post("/bnruserreport", ReportDataControllers.borrowandreturn_of_User_datareport);

/* รายงานสถิติข้อมูลการยืม-คืนหนังสือ  */
router.post("/bnrreport", ReportDataControllers.borrowandreturn_datareport);

/* รายงานหนังสือค้างส่ง */
router.post("/notreturnreport", ReportDataControllers.notReturn_datareport);


module.exports = router;