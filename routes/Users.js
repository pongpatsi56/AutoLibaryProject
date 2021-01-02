const express = require('express');
const router = express.Router();


const UserControllers = require('../controllers/users');

/* User Login */
router.post("/login", UserControllers.list_user_login);

/* User Login */
router.get("/checkmemberexist/:memid", UserControllers.check_memid);

/*List DataUser to Edit  */
router.get("/listedituser/:memid", UserControllers.list_userinfo_toEdit);

/* Edit DataUser by User */
router.put("/edituserbyuser", UserControllers.update_edituser_byuser);

/* Edit DataUser by Admin & Librarian */
router.put("/edituserbylib", UserControllers.update_edituser_bylib);

/* List All Datauser to Manage by Admin & Librarian */
router.get("/listalluser", UserControllers.list_All_UserData_toManage);

/* Add New User by Admin & Librarian */
router.post("/adduser", UserControllers.create_New_User);

/* Delete User by Admin & Librarian */
router.delete("/deluser/:id", UserControllers.delete_User);


module.exports = router;