const express = require('express');
const router = express.Router();


const BorrowandReturnControllers = require('../controllers/borrownreturn');

/* List Data Borrow And Return by owner */
router.get("/listbnr/:memid", BorrowandReturnControllers.List_BorrowAndReturn_Data);


module.exports = router;