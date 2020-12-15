const express = require('express');
const router = express.Router();


const UserControllers = require('../controllers/users');

/* User Login */
router.post("/login", UserControllers.list_user_login);


module.exports = router;