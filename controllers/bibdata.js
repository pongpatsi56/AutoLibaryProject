const { databib_item, databib, sequelize } = require('../models');
const { Op } = require('sequelize');
const { default: ShortUniqueId } = require('short-unique-id')
const moment = require('moment');

exports.list_all_bib = (req, res) => {
    databib.findAll().then(databibs => res.send(databibs));
};

exports.list_databib_by_id = (req, res) => {
    databib.findAll({
        where: {
            Bib_ID: req.params.id
        },
        order: ['Field']
    }).then(databib => res.send(databib));
};

exports.list_bibitem_by_id = async(req, res) => {
    const bibId = req.params.id;
    const datafield = await databib.sequelize.query(
        'SELECT `databib_item`.`Barcode`, `databib_item`.`Bib_ID`, `databib_item`.`Copy`, `databib_item`.`item_status`, `databib_item`.`item_in`, `databib_item`.`item_out`, `databib_item`.`libid_getitemin`, `databib_item`.`libid_getitemout`, `databib_item`.`item_description`, `databib_item`.`createdAt`, `databib_item`.`updatedAt`, `databibs`.`Bib_ID` AS `databibs.Bib_ID`, `databibs`.`Subfield` AS `databibs.Subfield` FROM `databib_items` AS `databib_item` LEFT OUTER JOIN `databibs` AS `databibs` ON `databib_item`.`Bib_ID` = `databibs`.`Bib_ID` AND `databibs`.`Field` = 245 WHERE `databib_item`.`Bib_ID` ='+ bibId , 
        { type: databib.sequelize.QueryTypes.SELECT })
    res.json(datafield);
};

exports.list_databib_all_infomation = async (req, res) => {
    var resData = [];
    var headerBook = [];
    var getMarc = await databib.findAll({
        attributes: ['Bib_ID', 'Field', 'Indicator1', 'Indicator2', 'Subfield'],
        where: { Bib_ID: req.params.id },
        order: ['Field']
    });
    var getItemBook = await databib_item.findAll({
        attributes: ['Bib_ID', 'Barcode', 'Copy'],
        where: { Bib_ID: req.params.id }
    });
    var getCallNo = await databib.findOne({
        attributes: ['Subfield'], where: { Field: '082', Bib_ID: req.params.id }
    });

    ///// region HeadBook /////
    for (const key in Object.keys(getMarc)) {
        var title, author, publish, callno, isbn, picpath;
        if (parseInt(getMarc[key].dataValues.Field) === parseInt(245)) {
            title = getMarc[key].dataValues.Subfield
            .replace('\\a', '$a')
            .replace('\\b', '$b')
            .replace('\\c', '$c')
            .replace('\\d', '$d')
            .replace('\\e', '$e')
            .replace('\\f', '$f')
            .replace('\\g', '$g')
            .replace('\\h', '$h')
            .replace('\\i', '$i')
            .replace('\\j', '$j')
            .replace('\\k', '$k')
            .replace('\\l', '$l')
            .replace('\\m', '$m')
            .replace('\\n', '$n')
            .replace('\\o', '$o')
            .replace('\\p', '$p')
            .replace('\\q', '$q')
            .replace('\\r', '$r')
            .replace('\\s', '$s')
            .replace('\\t', '$t')
            .replace('\\u', '$u')
            .replace('\\v', '$v')
            .replace('\\w', '$w')
            .replace('\\x', '$x')
            .replace('\\y', '$y')
            .replace('\\z', '$z')
            .replace('/', '')
        }
        if (parseInt(getMarc[key].dataValues.Field) === parseInt(100)) {
            author = getMarc[key].dataValues.Subfield
            .replace('\\a', '$a')
            .replace('\\b', '$b')
            .replace('\\c', '$c')
            .replace('\\d', '$d')
            .replace('\\e', '$e')
            .replace('\\f', '$f')
            .replace('\\g', '$g')
            .replace('\\h', '$h')
            .replace('\\i', '$i')
            .replace('\\j', '$j')
            .replace('\\k', '$k')
            .replace('\\l', '$l')
            .replace('\\m', '$m')
            .replace('\\n', '$n')
            .replace('\\o', '$o')
            .replace('\\p', '$p')
            .replace('\\q', '$q')
            .replace('\\r', '$r')
            .replace('\\s', '$s')
            .replace('\\t', '$t')
            .replace('\\u', '$u')
            .replace('\\v', '$v')
            .replace('\\w', '$w')
            .replace('\\x', '$x')
            .replace('\\y', '$y')
            .replace('\\z', '$z')
            .replace('/', '')
        }
        if (parseInt(getMarc[key].dataValues.Field) === parseInt(260)) {
            publish = getMarc[key].dataValues.Subfield
            .replace('/', '')
            .replace('\\a', '$a')
            .replace('\\b', '$b')
            .replace('\\c', '$c')
            .replace('\\d', '$d')
            .replace('\\e', '$e')
            .replace('\\f', '$f')
            .replace('\\g', '$g')
            .replace('\\h', '$h')
            .replace('\\i', '$i')
            .replace('\\j', '$j')
            .replace('\\k', '$k')
            .replace('\\l', '$l')
            .replace('\\m', '$m')
            .replace('\\n', '$n')
            .replace('\\o', '$o')
            .replace('\\p', '$p')
            .replace('\\q', '$q')
            .replace('\\r', '$r')
            .replace('\\s', '$s')
            .replace('\\t', '$t')
            .replace('\\u', '$u')
            .replace('\\v', '$v')
            .replace('\\w', '$w')
            .replace('\\x', '$x')
            .replace('\\y', '$y')
            .replace('\\z', '$z')
        }
        if (parseInt(getMarc[key].dataValues.Field) === parseInt(082)) {
            callno = getMarc[key].dataValues.Subfield
            .replace('\\a', '$a')
            .replace('\\b', '$b')
            .replace('\\c', '$c')
            .replace('\\d', '$d')
            .replace('\\e', '$e')
            .replace('\\f', '$f')
            .replace('\\g', '$g')
            .replace('\\h', '$h')
            .replace('\\i', '$i')
            .replace('\\j', '$j')
            .replace('\\k', '$k')
            .replace('\\l', '$l')
            .replace('\\m', '$m')
            .replace('\\n', '$n')
            .replace('\\o', '$o')
            .replace('\\p', '$p')
            .replace('\\q', '$q')
            .replace('\\r', '$r')
            .replace('\\s', '$s')
            .replace('\\t', '$t')
            .replace('\\u', '$u')
            .replace('\\v', '$v')
            .replace('\\w', '$w')
            .replace('\\x', '$x')
            .replace('\\y', '$y')
            .replace('\\z', '$z')
            .replace('/', '')
        }
        if (parseInt(getMarc[key].dataValues.Field) === parseInt(020)) {
            isbn = getMarc[key].dataValues.Subfield
            .replace('\\a', '$a')
            .replace('\\b', '$b')
            .replace('\\c', '$c')
            .replace('\\d', '$d')
            .replace('\\e', '$e')
            .replace('\\f', '$f')
            .replace('\\g', '$g')
            .replace('\\h', '$h')
            .replace('\\i', '$i')
            .replace('\\j', '$j')
            .replace('\\k', '$k')
            .replace('\\l', '$l')
            .replace('\\m', '$m')
            .replace('\\n', '$n')
            .replace('\\o', '$o')
            .replace('\\p', '$p')
            .replace('\\q', '$q')
            .replace('\\r', '$r')
            .replace('\\s', '$s')
            .replace('\\t', '$t')
            .replace('\\u', '$u')
            .replace('\\v', '$v')
            .replace('\\w', '$w')
            .replace('\\x', '$x')
            .replace('\\y', '$y')
            .replace('\\z', '$z')
            .replace('/', '')
        }
        if (parseInt(getMarc[key].dataValues.Field) === parseInt(960)) {
            picpath = getMarc[key].dataValues.Subfield
            .replace('\\a', '$a')
            .replace('\\b', '$b')
            .replace('\\c', '$c')
            .replace('\\d', '$d')
            .replace('\\e', '$e')
            .replace('\\f', '$f')
            .replace('\\g', '$g')
            .replace('\\h', '$h')
            .replace('\\i', '$i')
            .replace('\\j', '$j')
            .replace('\\k', '$k')
            .replace('\\l', '$l')
            .replace('\\m', '$m')
            .replace('\\n', '$n')
            .replace('\\o', '$o')
            .replace('\\p', '$p')
            .replace('\\q', '$q')
            .replace('\\r', '$r')
            .replace('\\s', '$s')
            .replace('\\t', '$t')
            .replace('\\u', '$u')
            .replace('\\v', '$v')
            .replace('\\w', '$w')
            .replace('\\x', '$x')
            .replace('\\y', '$y')
            .replace('\\z', '$z')
        }
    }
    title = (title) ? title : 'NoTitleBook';
    author = author ? author : 'NoAuthorBook';
    publish = publish ? publish : 'NoPublishBook';
    callno = callno ? callno : 'NoCallNoBook';
    isbn = isbn ? isbn : 'NoISBNBook';
    picpath = picpath ? picpath : 'https://autolibraryrmutlthesisproject.000webhostapp.com/lib/img/Noimgbook.jpg';
    headerBook.push({
        "Title": title,
        "Author": author,
        "Publish": publish,
        "CallNo": callno,
        "ISBN": isbn,
        "PicPath": picpath
    });
    ///////////////////////

    ///// region MARC /////
    for (const key in Object.keys(getMarc)) {
        getMarc[key].dataValues.Subfield = getMarc[key].dataValues.Subfield
        .replace('\\a', '$a')
        .replace('\\b', '$b')
        .replace('\\c', '$c')
        .replace('\\d', '$d')
        .replace('\\e', '$e')
        .replace('\\f', '$f')
        .replace('\\g', '$g')
        .replace('\\h', '$h')
        .replace('\\i', '$i')
        .replace('\\j', '$j')
        .replace('\\k', '$k')
        .replace('\\l', '$l')
        .replace('\\m', '$m')
        .replace('\\n', '$n')
        .replace('\\o', '$o')
        .replace('\\p', '$p')
        .replace('\\q', '$q')
        .replace('\\r', '$r')
        .replace('\\s', '$s')
        .replace('\\t', '$t')
        .replace('\\u', '$u')
        .replace('\\v', '$v')
        .replace('\\w', '$w')
        .replace('\\x', '$x')
        .replace('\\y', '$y')
        .replace('\\z', '$z')
        .replace('/', '')
    }
    ///////////////////////

    ///// region item /////
    for (const run in Object.keys(getItemBook)) {
        if (getItemBook[run].dataValues.Copy == null || getItemBook[run].dataValues.Copy == undefined) { getItemBook[run].dataValues.Copy = '-' }
        if (getCallNo) {
            getItemBook[run].dataValues.CallNo = getCallNo.toJSON().Subfield.replace('\\a', '').replace('\\b', '').replace('\\c', '').replace('\\d', '').replace('/', '');
        } else {
            getItemBook[run].dataValues.CallNo = '-';
        }
    }
    ////////////////////////

    resData.push(headerBook, getMarc, getItemBook)
    res.json(resData);
};

exports.list_databib_searching_pagination = async (req, res) => {
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
        var getISBN = await databib.findOne({ attributes: [['Subfield', 'ISBN']], where: { Field: '020', Bib_ID: GetAllBibID[key].Bib_ID } });
        if (getTitleBib) { var title = getTitleBib.toJSON().Title.replace('\\a', '').replace('\\b', '').replace('\\c', '').replace('\\d', '').replace('\\e', '') } else var title = '-';
        if (getAuthorBib) { var author = getAuthorBib.toJSON().Author.replace('\\a', '').replace('\\b', '').replace('\\c', '').replace('\\d', '').replace('\\e', '') } else var author = '-';
        if (getPublishBib) { var publish = getPublishBib.toJSON().Publish.replace('\\a', '').replace('\\b', '').replace('\\c', '').replace('\\d', '').replace('\\e', '') } else var publish = '-';
        if (getCallNoBib) { var callno = getCallNoBib.toJSON().CallNo.replace('\\a', '').replace('\\b', '').replace('\\c', '').replace('\\d', '').replace('\\e', '') } else var callno = '-';
        if (getISBN) { var isbn = getISBN.toJSON().ISBN.replace('\\a', '').replace('\\b', '').replace('\\c', '').replace('\\d', '').replace('\\e', '') } else var isbn = '-';
        if (getPicPath) {
            var picpath = getPicPath.toJSON().PicPath.replace('\\a', '');
            if (picpath == '') {
                ////// Set Default NoImgPicture /////
                picpath = 'https://autolibraryrmutlthesisproject.000webhostapp.com/lib/img/Noimgbook.jpg'
            }
        } else var picpath = '-';
        ObjDataBib = {
            Bib_ID: GetAllBibID[key].Bib_ID,
            Title: title,
            Author: author,
            Publish: publish,
            CallNo: callno,
            ISBN: isbn,
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
    Results.pagiInfo = {
        currentPage: Page,
        countPage: Math.ceil(ObjDataBiball.length / limit),
        limit: limit
    }
    Results.Results = ObjDataBiball.slice(StartIndex, EndIndex)
    console.log(ObjDataBiball);
    res.send(Results);
};

exports.list_bibdata_raw_queries = async (req, res) => {
    const datafield = await databib.sequelize.query('SELECT * FROM databibs WHERE Field = "245"', { type: databib.sequelize.QueryTypes.SELECT })
    res.send(datafield);
};

exports.get_MaxBibId = async (req, res) => {
    await databib.sequelize.query(
        'SELECT MAX(Bib_ID) AS maxID FROM databibs ',
     { type: databib.sequelize.QueryTypes.SELECT }
     ).then((maxBibId) =>{
        // Object.assign(maxBibId,{maxID : parseInt(maxID) + 1})
        res.send(maxBibId);
     })
};

exports.create_databib_bulk = async (req, res) => {
    try {
        const uid = new ShortUniqueId();
        const genBibId = uid(10);
        const resObjBody = req.body.databib;
        for (const key in resObjBody) {
            Object.assign(resObjBody[key] , {"Bib_ID": genBibId});
            let strSubfield ='';
            for (const [run, value] of Object.entries(resObjBody[key]["Subfield"])) {
                strSubfield+= `${run}${value}`;
              }
              resObjBody[key]["Subfield"] = strSubfield;
        }
        await databib.bulkCreate(resObjBody).then(outp => res.json(outp));
    } catch (e) {
        console.log(e);
        res.json(e);
    }
};

exports.create_databib = (req, res) => {
    try {
        const { bibId, field, indc1, indc2, subfield } = req.body;
        console.log(bibId);
        console.log(field);
        console.log(indc1);
        console.log(indc2);
        console.log(subfield);
        // databib.create({
        //   Bib_ID: bibId,
        //   Field: field,
        //   Indicator1: indc1,
        //   Indicator2: indc2,
        //   Subfield: subfield
        // });
        res.send(req.body);
    } catch (error) {
        console.log('Error:', error);
    }
};

exports.update_databib = async (req, res) => {
    try {
        const { databib_ID, subfield, indc1, indc2 } = req.body;
        await databib.update(
            {
                Indicator1: indc1,
                Indicator2: indc2,
                Subfield: subfield
            },
            {
                where: {
                    databib_ID: databib_ID
                }
            }
        ).then(res.json(await databib.findAll({ where: { databib_ID: databib_ID } })))
    } catch (e) {
        console.log(e);
    }
};

exports.delete_databib = (req, res) => {
    databib.destroy({
        where: {
            id: req.params.id
        }
    }).then(() => res.send("success"));
};