const express = require('express');
const router = express.Router();


const BorrowandReturnControllers = require('../controllers/borrownreturn');

/* List Data Borrow And Return by owner */
router.get("/listbnr/:memid", BorrowandReturnControllers.List_BorrowAndReturn_Data);

/* Add  Borrow by librarian */
router.post("/addborrow", BorrowandReturnControllers.create_Borrow_Data);

/* Add  Borrow by librarian */
router.put("/updreturn", BorrowandReturnControllers.update_Return_Data);


module.exports = router;