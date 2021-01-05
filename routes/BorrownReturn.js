const express = require('express');
const router = express.Router();


const BorrowandReturnControllers = require('../controllers/borrownreturn');

/* List User to get All BorrowandReturn data*/
router.get("/listuserbnr/:keyword", BorrowandReturnControllers.List_data_User);

/* List DatabibItem to Borrow*/
router.get("/listbookbnr/:brcd", BorrowandReturnControllers.List_itemBooktoBorrow);

/* List AllData Borrow And Return*/
router.get("/listbnr/:memid", BorrowandReturnControllers.List_All_BorrowandReturn);

/* List All fine receipt by User*/
router.get("/listallfine/:memid", BorrowandReturnControllers.List_All_FineReceipt);

/* Add  Borrow by librarian */
router.post("/addborrow", BorrowandReturnControllers.create_Borrow_Data);

/* Update Borrow and Create fine_receipt by librarian */
router.put("/updreturn", BorrowandReturnControllers.updateReturn_and_createReceipt_Data);

/* Update fine_receipt by librarian */
router.put("/updatefinereceipt", BorrowandReturnControllers.Update_FineReceipt);


module.exports = router;