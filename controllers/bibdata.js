const { databib_item, databib, sequelize } = require('../models');
const { Op } = require('sequelize');
const { default: ShortUniqueId } = require('short-unique-id');
const formidable = require('formidable');
const path = require('path');
const helper = require('../helper/stringHelper');
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

exports.list_databib_subfieldObj_by_id = async (req, res) => {
    try {
        const db = await databib.findAll({
            where: {
                Bib_ID: req.params.id
            },
            order: ['Field']
        });
        if (db) {
            for (const val of db) {
                val.Subfield = helper.subfloopToObject(val.Subfield)
            };
        }
        res.json(db);
    } catch (e) {
        console.log(e);
        res.send(e);
    }
};

exports.list_bibitem_by_id = async (req, res) => {
    try {
        if (req.params.id) {
            await sequelize.query(
                "SELECT `databib_item`.`Barcode`, `databib_item`.`Bib_ID`, `databib_item`.`Copy`, `databib_item`.`item_status`, `databib_item`.`item_in`, `databib_item`.`item_out`, `databib_item`.`libid_getitemin`, `databib_item`.`libid_getitemout`, `databib_item`.`item_description`, `databib_item`.`createdAt`, `databib_item`.`updatedAt`,REPLACE (REPLACE (REPLACE (REPLACE (REPLACE (REPLACE (REPLACE (`databibsforname`.`Subfield`,'$a',''),'$b',''),'$c',''),'$e',''),'$f',''),'$g',''),'$h','') AS `Booknames`,REPLACE (REPLACE (REPLACE (REPLACE (REPLACE (REPLACE (REPLACE (`databibsforcallno`.`Subfield`,'$a',''),'$b',''),'$c',''),'$e',''),'$f',''),'$g',''),'$h','') AS `CallNos`FROM `databib_items` AS `databib_item` LEFT OUTER JOIN `databibs` AS `databibsforname` ON `databib_item`.`Bib_ID` = `databibsforname`.`Bib_ID` AND `databibsforname`.`Field` = '245' LEFT OUTER JOIN `databibs` AS `databibsforcallno` ON `databib_item`.`Bib_ID` = `databibsforcallno`.`Bib_ID` AND `databibsforcallno`.`Field` = '082' WHERE `databib_item`.`Bib_ID` = '" + req.params.id + "'",
                { type: sequelize.QueryTypes.SELECT })
                .then(datafield => {
                    if (datafield && datafield != null && datafield != '') {
                        res.json(datafield)
                    } else {
                        res.json({ msg: `Data does not exist.` })
                    }
                });
        } else {
            res.json({ msg: `Request must be not empty.` })
        }
    } catch (e) {
        console.log(e);
        res.send(e);
    }
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
        attributes: ['Bib_ID', 'Barcode', 'Copy', 'item_status'],
        where: { Bib_ID: req.params.id }
    });
    var getCallNo = await databib.findOne({
        attributes: ['Subfield'], where: { Field: '082', Bib_ID: req.params.id }
    });

    ///// region HeadBook /////
    for (const key in Object.keys(getMarc)) {
        var title, author, publish, callno, isbn, picpath;
        if (parseInt(getMarc[key].dataValues.Field) === parseInt(245)) {
            title = helper.subfReplaceToBlank(getMarc[key].dataValues.Subfield.replace('/', ''))
        }
        if (parseInt(getMarc[key].dataValues.Field) === parseInt(100)) {
            author = helper.subfReplaceToBlank(getMarc[key].dataValues.Subfield.replace('/', ''))
        }
        if (parseInt(getMarc[key].dataValues.Field) === parseInt(260)) {
            publish = helper.subfReplaceToBlank(getMarc[key].dataValues.Subfield.replace('/', ''))
        }
        if (parseInt(getMarc[key].dataValues.Field) === parseInt(082)) {
            callno = helper.subfReplaceToBlank(getMarc[key].dataValues.Subfield.replace('/', ''))
        }
        if (parseInt(getMarc[key].dataValues.Field) === parseInt(020)) {
            isbn = helper.subfReplaceToBlank(getMarc[key].dataValues.Subfield.replace('/', ''))
        }
        if (parseInt(getMarc[key].dataValues.Field) === parseInt(960)) {
            picpath = helper.subfReplaceToBlank(getMarc[key].dataValues.Subfield)
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
    // for (const key in Object.keys(getMarc)) {
    //     getMarc[key].dataValues.Subfield =  getMarc[key].dataValues.Subfield
    // }
    ///////////////////////

    ///// region item /////
    for (const run in Object.keys(getItemBook)) {
        if (getItemBook[run].dataValues.Copy == null || getItemBook[run].dataValues.Copy == undefined) { getItemBook[run].dataValues.Copy = '-' }
        if (getCallNo) {
            getItemBook[run].dataValues.CallNo = helper.subfReplaceToBlank(getCallNo.toJSON().Subfield.replace('/', ''));
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
        if (getTitleBib) { var title = getTitleBib.toJSON().Title.replace('$a', '').replace('$b', '').replace('$c', '').replace('$d', '').replace('$e', '') } else var title = '-';
        if (getAuthorBib) { var author = getAuthorBib.toJSON().Author.replace('$a', '').replace('$b', '').replace('$c', '').replace('$d', '').replace('$e', '') } else var author = '-';
        if (getPublishBib) { var publish = getPublishBib.toJSON().Publish.replace('$a', '').replace('$b', '').replace('$c', '').replace('$d', '').replace('$e', '') } else var publish = '-';
        if (getCallNoBib) { var callno = getCallNoBib.toJSON().CallNo.replace('$a', '').replace('$b', '').replace('$c', '').replace('$d', '').replace('$e', '') } else var callno = '-';
        if (getISBN) { var isbn = getISBN.toJSON().ISBN.replace('$a', '').replace('$b', '').replace('$c', '').replace('$d', '').replace('$e', '') } else var isbn = '-';
        if (getPicPath) {
            var picpath = getPicPath.toJSON().PicPath.replace('$a', '');
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
        Total: ObjDataBiball.length,
        currentPage: Page,
        countPage: Math.ceil(ObjDataBiball.length / limit),
        limit: limit
    }
    // console.log(ObjDataBiball);
    if (ObjDataBiball && ObjDataBiball != null && ObjDataBiball != '') {
        Results.Results = ObjDataBiball.slice(StartIndex, EndIndex)
    } else {
        Results.Results = { msg: `<b>${Keyword}</b> is not found.` };
    }
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
    ).then((maxBibId) => {
        // Object.assign(maxBibId,{maxID : parseInt(maxID) + 1})
        res.send(maxBibId);
    })
};

exports.create_databib_bulk = async (req, res) => {
    try {
        const uid = new ShortUniqueId();
        const genBibId = uid(10);
        const resObjBody = req.body.databib;
        if (resObjBody && resObjBody != null && resObjBody != '') {
            for (const key in resObjBody) {
                Object.assign(resObjBody[key], { "Bib_ID": genBibId });
                let strSubfield = '';
                for (const [run, value] of Object.entries(resObjBody[key]["Subfield"])) {
                    strSubfield += `${run}${value}`;
                }
                resObjBody[key]["Subfield"] = strSubfield;
            }
            await databib.bulkCreate(resObjBody).then(outp => res.json(outp));
        } else {
            res.json({ msg: `Bad Request.` })
        }
        // res.send(genBibId);
    } catch (e) {
        console.log(e);
        res.json(e);
    }
};

exports.Upload_coverbook_img = async (req, res) => {
    try {
        var form = new formidable.IncomingForm();
        form.parse(req);
        form.on('fileBegin', (name, file) => {
            const [fileName, fileExt] = file.name.split('.')
            file.path = path.join('uploads', `${fileName}_${new Date().getTime()}.${fileExt}`)
            console.log('Uploaded ' + file.path);
            // const addbib = await databib.create({
            //     Bib_ID: res.body.bibId,
            //     Field: res.body.field,
            //     Subfield: '$a' + file.path
            // });
        })
        res.json('Upload Success.');
    } catch (error) {
        console.log(error);
        res.json(error);
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

exports.create_databib_item = async (req, res) => {
    try {
        const { brcd, bbid, copy, lbin, ides } = req.body;
        let datenow = moment().format('YYYY-MM-DD HH:mm:ss');
        const chkDataBib = await databib.findOne({ where: { Bib_ID: bbid } });
        const getBooknames = await databib.findOne({ attributes: ['Subfield'], where: { Bib_ID: bbid, Field: '245' } });
        let booknames = (getBooknames && getBooknames != null && getBooknames != '') ? JSON.stringify(getBooknames["Subfield"]) : bbid;
        if (chkDataBib && chkDataBib != null && chkDataBib != '') {
            databib_item.create({
                Barcode: brcd,
                Bib_ID: bbid,
                Copy: copy,
                item_status: 'Available',
                item_in: datenow,
                item_out: null,
                libid_getitemin: lbin,
                libid_getitemout: null,
                item_description: ides
            }).then(responses => {
                res.json({
                    status: 200,
                    Results: responses,
                    msg: `Item of ${helper.subfReplaceToBlank(booknames)} has been Added.`
                })
            });
        } else {
            res.json({ msg: `This Bibliography has not found.` });
        }
    } catch (error) {
        console.log('Error:', error);
        res.send(error);

    }
};

exports.update_databib = async (req, res) => {
    try {
        const edit_data = req.body.databib;
        if (edit_data && edit_data != null && edit_data != '') {
            for (const key in edit_data) {
                if (edit_data[key]["Subfield"] != '' && edit_data[key]["Subfield"] != null && edit_data[key]["Subfield"] != undefined && JSON.stringify(edit_data[key]["Subfield"]) !== JSON.stringify({})) {
                    let strSubfield = '';
                    for (const [run, value] of Object.entries(edit_data[key]["Subfield"])) {
                        strSubfield += `${run}${value}`;
                    }
                    edit_data[key]["Subfield"] = strSubfield;
                }
            }
            await databib.bulkCreate(edit_data,
                {
                    fields: ['databib_ID', 'Bib_ID', 'Field', 'Indicator1', 'Indicator2', 'Subfield'],
                    updateOnDuplicate: ['Indicator1', 'Indicator2', 'Subfield']
                }).then((results) => { res.json(results) });
        } else {
            res.json({ msg: `Bad Request.` })
        }
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

exports.update_bibItem_description = async (req, res) => {
    try {
        const { brcd, ides, libid } = req.body;
        let datenow = moment().format('YYYY-MM-DD HH:mm:ss');
        if (brcd != null && brcd != '' && ides != null && ides != '') {
            await databib_item.update(
                {
                    item_status: 'Remove',
                    item_out: datenow,
                    item_description: ides,
                    libid_getitemout: libid
                },
                { where: { Barcode: brcd } }
            ).then(results => {
                if (results) {
                    res.json({
                        status: 200,
                        Results: 'Update Success.',
                        msg: `Item ${brcd} has Updated `
                    })
                } else { res.json({ msg: `Updating some mistakes.` }) }
            });
        } else {
            res.json({ msg: `BAD REQUEST.` });
        }
    } catch (error) {
        console.log('Error:', error);
        res.send(error);

    }
};
