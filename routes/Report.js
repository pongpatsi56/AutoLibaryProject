const express = require('express');
const router = express.Router();


const ReportDataControllers = require('../controllers/report');

/* รายงานข้อมูลการยืมสมาชิก */
router.post("/bnruserreport", ReportDataControllers.borrowandreturn_of_User_datareport);

/* รายงานข้อมูลหนังสือ */
router.post("/databibreport", ReportDataControllers.bibliography_datareport);

/* รายงานสถิติข้อมูลการยืม-คืนหนังสือ  */
router.post("/bnrreport", ReportDataControllers.borrowandreturn_datareport);

/* รายงานสถิติการเข้าใช้ห้องสมุด */
router.post("/statbnrreport", ReportDataControllers.statistic_borrowandreturn_datareport);

/* รายงานหนังสือค้างส่ง */
router.post("/notreturnreport", ReportDataControllers.notReturn_datareport);

/* รายงานค่าปรับ */
router.post("/finesreport", ReportDataControllers.Fine_receipt_datareport);

/* รายงานการตัดจำหน่ายหนังสือ */
router.post("/descriptreport", ReportDataControllers.bibitem_description);


module.exports = router;