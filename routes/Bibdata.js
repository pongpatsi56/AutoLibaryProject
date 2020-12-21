const express = require('express');
const router = express.Router();

const BibDataControllers = require('../controllers/bibdata');

// get all databibs
router.get("/all", BibDataControllers.list_all_bib);

// get databib by id
router.get("/bibinfo/:id", BibDataControllers.list_databib_by_id);

// get bibitem by id
router.get("/bibitem/:id", BibDataControllers.list_bibitem_by_id);

// get bibitem for InfomationPage
router.get("/allbib/:id", BibDataControllers.list_databib_all_infomation);

// get bib for SearchingPage
router.get("/findbook/:keyword", BibDataControllers.list_databib_searching_pagination);

// raw query databib
router.get("/raw", BibDataControllers.list_bibdata_raw_queries);

// get max bib id
router.get("/maxbibid", BibDataControllers.get_MaxBibId);

// ADD Book
router.post("/bulkadd", BibDataControllers.create_databib_bulk);

router.post("/new", BibDataControllers.create_databib);

// Add databib item
router.post("/addnewitem", BibDataControllers.create_databib_item);

// edit a databib
router.put("/edit", BibDataControllers.update_databib);

// delete databib
router.delete("/delete/:id", BibDataControllers.delete_databib);

module.exports = router;