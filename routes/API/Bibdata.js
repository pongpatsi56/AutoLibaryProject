const e = require('express');
const express = require('express');
const { sequelize, Op } = require('sequelize');
const router = express.Router();
const { databib_item, databib, db } = require('../../models');


// get all databibs
router.get("/all", (req, res) => {
  databib.findAll().then(databibs => res.send(databibs));
});

// get databib by id
router.get("/bibinfo/:id", (req, res) => {
  databib.findAll({
    where: {
      Bib_ID: req.params.id
    },
    order: ['Field']
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
  databib.belongsTo(databib_item, { foreignKey: 'Bib_ID', associateKey: 'Bib_ID' });
  databib.findAll({
    include: [{
      model: databib_item
    }],
    where: { Bib_ID: req.params.id }
  }).then(databibitem => res.send(databibitem));
});

// get findlimit
router.get("/findbook/:keyword", async (req, res) => {
  var Keyword = req.params.keyword != null ? req.params.keyword : '';
  var Page = parseInt(req.query.StartPage);
  var limit = parseInt(req.query.perPage);
  var StartIndex = (Page - 1) * limit;
  var EndIndex = Page * limit;
  var Results = {};

  var ObjDataBiball = [];
  var ObjDataBib = [];
  var GetAllBibID = await databib.findAll({
    attributes: ['Bib_ID'],
    where: {
      Subfield: {
        [Op.substring]: Keyword
      }
    },
    group: ['Bib_ID']
  });
  for (const key in Object.keys(GetAllBibID)) {
    var getTitleBib = await databib.findOne({ attributes: [['Subfield', 'Title']], where: { Field: '245', Bib_ID: GetAllBibID[key].Bib_ID } });
    var getAuthorBib = await databib.findOne({ attributes: [['Subfield', 'Author']], where: { Field: '100', Bib_ID: GetAllBibID[key].Bib_ID } });
    var getPublishBib = await databib.findOne({ attributes: [['Subfield', 'Publish']], where: { Field: '260', Bib_ID: GetAllBibID[key].Bib_ID } });
    var getCallNoBib = await databib.findOne({ attributes: [['Subfield', 'CallNo']], where: { Field: '082', Bib_ID: GetAllBibID[key].Bib_ID } });
    var getPicPath = await databib.findOne({ attributes: [['Subfield', 'PicPath']], where: { Field: '960', Bib_ID: GetAllBibID[key].Bib_ID } });
    if (getTitleBib) { var title = getTitleBib.toJSON().Title.replace('#a=','').replace('#b=','').replace('#c=','').replace('#d=','').replace('#e=','') } else var title = '-';
    if (getAuthorBib) { var author = getAuthorBib.toJSON().Author.replace('#a=','').replace('#b=','').replace('#c=','').replace('#d=','').replace('#e=','') } else var author = '-';
    if (getPublishBib) { var publish = getPublishBib.toJSON().Publish.replace('#a=','').replace('#b=','').replace('#c=','').replace('#d=','').replace('#e=','') } else var publish = '-';
    if (getCallNoBib) { var callno = getCallNoBib.toJSON().CallNo.replace('#a=','').replace('#b=','').replace('#c=','').replace('#d=','').replace('#e=','') } else var callno = '-';
    if (getPicPath) { var picpath = getPicPath.toJSON().PicPath.replace('#a=','').replace('#b=','').replace('#c=','').replace('#d=','').replace('#e=','') } else var picpath = 'https://autolibraryrmutlthesisproject.000webhostapp.com/lib/img/Noimgbook.jpg';
    ObjDataBib = {
      Bib_ID : GetAllBibID[key].Bib_ID,
      Title: title,
      Author: author,
      Publish: publish,
      CallNo: callno,
      PicPath: picpath
    };
    ObjDataBiball.push(ObjDataBib);
  }
  
  if (StartIndex > 0) {
    Results.previous = {
      Page: Page - 1,
      limit: limit
    }
  }
  if (EndIndex < ObjDataBiball.length) {
    Results.next = {
      Page: Page + 1,
      limit: limit
    }
  }

  Results.Results = ObjDataBiball.slice(StartIndex, EndIndex)
  console.log(ObjDataBiball);
  res.send(Results);
});

// raw query databib
router.get("/raw", async (req, res) => {
  const datafield = await sequelize.query('SELECT * FORM databib WHERE Field = "245"', { type: sequelize.QueryTypes.SELECT })


  res.send(datafield);
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