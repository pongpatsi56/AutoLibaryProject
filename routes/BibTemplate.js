const express = require('express');
const router = express.Router();
const cors = require('cors');


const BibTemplateControllers = require('../controllers/bibtemplate');

/* get Template Selecter */
router.get("/listTempSelect", cors(), BibTemplateControllers.list_select_template);

/* get template by id*/
router.get("/listtemplatebib/:templateId", BibTemplateControllers.list_templatebyId);

/* create template*/
router.post("/addtempbib", BibTemplateControllers.create_template_databib);


module.exports = router;