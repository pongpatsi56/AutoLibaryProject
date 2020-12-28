const express = require('express');
const router = express.Router();


const BorrowandReturnControllers = require('../controllers/borrownreturn');

/* List User to get All BorrowandReturn data*/
router.get("/listuserbnr/:keyword", BorrowandReturnControllers.List_data_User);

/* List User to get All BorrowandReturn data*/
router.get("/listbookbnr/:brcd", BorrowandReturnControllers.List_itemBooktoBorrow);

/* List Data Borrow And Return by owner */
router.get("/listbnr/:memid", BorrowandReturnControllers.List_All_BorrowandReturn);

/* Add  Borrow by librarian */
router.post("/addborrow", BorrowandReturnControllers.create_Borrow_Data);

/* Add  Borrow by librarian */
router.put("/updreturn", BorrowandReturnControllers.update_Return_Data);


module.exports = router;