const express = require('express');
const router = express.Router();


const UserControllers = require('../controllers/users');

/* User Login */
router.post("/login", UserControllers.list_user_login);

/*List DataUser to Edit  */
router.get("/listedituser/:memid", UserControllers.list_userinfo_toEdit);

/* Edit DataUser */
router.put("/edituser", UserControllers.update_edit_user);

/* List All Datauser to Manage by Admin & Librarian */
router.get("/listalluser/:keyword", UserControllers.list_All_UserData_toManage);

/* Add New User by Admin & Librarian */
router.post("/adduser", UserControllers.create_New_User);


module.exports = router;