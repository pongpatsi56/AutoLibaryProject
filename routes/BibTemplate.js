const express = require('express');
const router = express.Router();


const BibTemplateControllers = require('../controllers/bibtemplate');

/* get Template Selecter */
router.get("/listTempSelect", BibTemplateControllers.list_select_template);

/* get template by id*/
router.get("/listtemplatebib/:templateId", BibTemplateControllers.list_templatebyId);

/* create template*/
router.post("/addtempbib", BibTemplateControllers.create_template_databib);

/* delete template*/
router.delete("/deltempbib/:templateId", BibTemplateControllers.delete_template_databib);


module.exports = router;