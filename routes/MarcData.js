const express = require('express');
const router = express.Router();


const MarcDataControllers = require('../controllers/marcdata');

/* get field indc1,2 subfield show for add book */
router.get("/addmarc/:tag", MarcDataControllers.marc_add_helper);


module.exports = router;