const express = require('express');
const {sequelize,Op} = require('sequelize');
const router = express.Router();
const { databib_item,databib,db } = require('../../models');


// get all databibs
router.get("/all", (req, res) => {
    databib.findAll().then(databibs => res.send(databibs));
  });
  
  // get databib by id
  router.get("/bibinfo/:id", (req, res) => {
    databib.findAll({
      where: {
        Bib_ID: req.params.id
      }
    }).then(databib => res.send(databib));
  });

  // get bibitem by id
  router.get("/bibitem/:id", (req, res) => {
    databib_item.findAll({
      where: {
        Bib_ID: req.params.id
      }
    }).then(databibitem => res.send(databibitem));
  });
  
  // get bibitem by id
  router.get("/allbib/:id", (req, res) => {
    databib_item.findAll({
      where: {Bib_ID: req.params.id},
      include:[{
        model:databib,
        where:{
          Bib_ID: req.params.id
        },
        required:false
      }]
    }).then(databibitem => res.send(databibitem));
  });

  // get findlimit
  router.get("/findbook/:keyword", async (req, res) => {
    var Keyword = req.params.keyword != null ? req.params.keyword : '';
    var Page = parseInt(req.query.StartPage);
    var limit = parseInt(req.query.perPage);
    console.log(Keyword);
    console.log(Page);
    console.log(limit);
    console.log('----------------------');
    console.log(req.params.keyword);
    var StartIndex = (Page - 1)* limit;
    var EndIndex = Page * limit;
    var Results = {};

    var ObjDataBib = [];
    var GetAllBibID = await databib.findAll({
      attributes: ['Bib_ID'],
      where:{
        Subfield :{
          [Op.substring]:Keyword
        }
      },
      group: ['Bib_ID']
    });
    var bibID = JSON.parse(JSON.stringify(GetAllBibID));
    for (const key in bibID) {
        var ObjSingleBib = await databib.findAll({attributes: ['Bib_ID','Field','Subfield'], where: bibID[key]});
        var datainfibib = JSON.parse(JSON.stringify(ObjSingleBib));
        ObjDataBib.push(datainfibib);
    }

    if (StartIndex > 0) {
      Results.previous = {
        Page: Page - 1,
        limit: limit
      }
    }
    if (EndIndex < ObjDataBib.length) {
      Results.next = {
        Page: Page + 1,
        limit: limit
      }
    }

    Results.Results = ObjDataBib.slice(StartIndex,EndIndex)
    console.log(JSON.parse(JSON.stringify(Results)));

  res.send(Results);
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