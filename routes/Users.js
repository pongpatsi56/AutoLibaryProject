const express = require('express');
const router = express.Router();
const authorize = require('../middleware/authorize');


const UserControllers = require('../controllers/users');

/* Generate Password to MD5*/
router.post("/genpass", UserControllers.genPassMD5);

/* User Login */
router.post("/login", UserControllers.list_user_login);

/* Check exist member id*/
router.get("/checkmemberexist/:memid", UserControllers.check_memid);

/*List DataUser to Edit  */
router.get("/listedituser/:memid", authorize , UserControllers.list_userinfo_toEdit);

/* Edit DataUser by User */
router.put("/edituserbyuser", UserControllers.update_edituser_byuser);

/* Edit DataUser by Admin & Librarian */
router.put("/edituserbylib", UserControllers.update_edituser_bylib);

/* List All Datauser to Manage by Admin & Librarian */
router.get("/listalluser", UserControllers.list_All_UserData_toManage);
router.get("/listalluseradmin", UserControllers.list_All_UserData_AdminManage);

/* Add New User by Admin & Librarian */
router.post("/adduser", UserControllers.create_New_User);

/* Delete User by Admin & Librarian */
router.delete("/deluser/:id", UserControllers.delete_User);


module.exports = router;