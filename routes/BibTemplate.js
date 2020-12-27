const express = require('express');
const router = express.Router();


const BibTemplateControllers = require('../controllers/bibtemplate');

/* get field indc1,2 subfield show for add book */
router.get("/listTempSelect", BibTemplateControllers.list_select_template);

/* get field indc1,2 subfield show for add book */
router.get("/listtemplatebib/:templateId", BibTemplateControllers.list_templatebyId);


module.exports = router;