const express = require('express');
const sequelize = require('sequelize');
const router = express.Router();
const { databibitem,databib,db } = require('../../models');


// get all databibs
router.get("/all", (req, res) => {
    databib.findAll().then(databibs => res.send(databibs));
  });
  
  // get single databib by id
  router.get("/find/:id", (req, res) => {
    databib.findAll({
      where: {
        Bib_ID: req.params.id
      }
    }).then(databib => res.send(databib));
    databibitem.findAll({
      where: {
        Bib_ID: req.params.id
      }
    }).then(databib => res.send(databib));

  });
  
  // raw query databib
  router.get("/raw", (req, res) => {
    db.sequelize
    .query('SELECT * FORM databib WHERE Field = "245"', { type: sequelize.QueryTypes.SELECT })
    .then(results => res.send(results))
  });

  // post new databib
  router.post("/new", (req, res) => {
    databib.create({
      text: req.body.text
    }).then(databib => res.send(databib));
  });
  
  // delete databib
  router.delete("/delete/:id", (req, res) => {
    databib.destroy({
      where: {
        id: req.params.id
      }
    }).then(() => res.send("success"));
  });
  
  // edit a databib
  router.put("/edit", (req, res) => {
    databib.update(
      {
        text: req.body.text
      },
      {
        where: { id: req.body.id }
      }
    ).then(() => res.send("success"));
  });
  
  module.exports = router;