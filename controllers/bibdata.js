const { databib_item, databib } = require('../models');
const { Op } = require('sequelize');
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

exports.list_bibitem_by_id = (req, res) => {
    databib_item.findAll({
        where: {
            Bib_ID: req.params.id
        }
    }).then(databibitem => res.send(databibitem));
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
            title = getMarc[key].dataValues.Subfield.replace('#a=', '').replace('#b=', '').replace('#c=', '').replace('/', '')
        }
        if (parseInt(getMarc[key].dataValues.Field) === parseInt(100)) {
            author = getMarc[key].dataValues.Subfield.replace('#a=', '').replace('#b=', '').replace('#c=', '').replace('/', '')
        }
        if (parseInt(getMarc[key].dataValues.Field) === parseInt(260)) {
            publish = getMarc[key].dataValues.Subfield.replace('/', '').replace('#a=', '').replace('#b=', '').replace('#c=', '')
        }
        if (parseInt(getMarc[key].dataValues.Field) === parseInt(082)) {
            callno = getMarc[key].dataValues.Subfield.replace('#a=', '').replace('#b=', '').replace('#c=', '').replace('/', '')
        }
        if (parseInt(getMarc[key].dataValues.Field) === parseInt(020)) {
            isbn = getMarc[key].dataValues.Subfield.replace('#a=', '').replace('#b=', '').replace('#c=', '').replace('/', '')
        }
        if (parseInt(getMarc[key].dataValues.Field) === parseInt(960)) {
            picpath = getMarc[key].dataValues.Subfield.replace('#a=', '').replace('#b=', '').replace('#c=', '')
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
        getMarc[key].dataValues.Subfield = getMarc[key].dataValues.Subfield.replace('#a=', '$a').replace('#b=', '$b').replace('#c=', '$c').replace('#d=', '$d').replace('#e=', '$e').replace('/', '')
    }
    ///////////////////////

    ///// region item /////
    for (const run in Object.keys(getItemBook)) {
        if (getItemBook[run].dataValues.Copy == null || getItemBook[run].dataValues.Copy == undefined) { getItemBook[run].dataValues.Copy = '-' }
        if (getCallNo) {
            getItemBook[run].dataValues.CallNo = getCallNo.toJSON().Subfield.replace('#a=', '').replace('#b=', '').replace('#c=', '').replace('#d=', '').replace('/', '');
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
        if (getTitleBib) { var title = getTitleBib.toJSON().Title.replace('#a=', '').replace('#b=', '').replace('#c=', '').replace('#d=', '').replace('#e=', '') } else var title = '-';
        if (getAuthorBib) { var author = getAuthorBib.toJSON().Author.replace('#a=', '').replace('#b=', '').replace('#c=', '').replace('#d=', '').replace('#e=', '') } else var author = '-';
        if (getPublishBib) { var publish = getPublishBib.toJSON().Publish.replace('#a=', '').replace('#b=', '').replace('#c=', '').replace('#d=', '').replace('#e=', '') } else var publish = '-';
        if (getCallNoBib) { var callno = getCallNoBib.toJSON().CallNo.replace('#a=', '').replace('#b=', '').replace('#c=', '').replace('#d=', '').replace('#e=', '') } else var callno = '-';
        if (getPicPath) {
            var picpath = getPicPath.toJSON().PicPath.replace('#a=', '');
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

exports.create_databib_bulk = async (req, res) => {
    try {
        const ObjDataBib = JSON.stringify(req.body.databib);
        const dateObj = { createdAt: moment().format('YYYY-MM-D HH:mm:ss'), updatedAt: moment().format('YYYY-MM-D HH:mm:ss') }
        // for (const key in Object.keys(ObjDataBib)) {
        //     await Object.assign(ObjDataBib[key], dateObj);
        //     console.log(ObjDataBib[key]);
        // }
        console.log(ObjDataBib);
        console.log(dateObj);
        await databib.bulkCreate([ObjDataBib]).then(outp => res.json(outp));
            // { "Bib_ID": "b00149574", "Field": "Leader", "Indicator1": "", "Indicator2": "", "Subfield": "00700cam##2200229ua#4500" }
            // { "Bib_ID": "b00149574", "Field": "001", "Indicator1": "#", "Indicator2": "#", "Subfield": "b00149574" }
            // { "Bib_ID": "b00149574", "Field": "005", "Indicator1": "#", "Indicator2": "#", "Subfield": "20200415040221.6" }
            // { "Bib_ID": "b00149574", "Field": "008", "Indicator1": "#", "Indicator2": "#", "Subfield": "191009s2562##th#a##g####000#0#tha#d" }
            // { "Bib_ID": "b00149574", "Field": "020", "Indicator1": "#", "Indicator2": "#", "Subfield": "\a 9786162624858" }
            // { "Bib_ID": "b00149574", "Field": "050", "Indicator1": "1", "Indicator2": "4", "Subfield": "\a QA76.73.P98 \b ส826ก 2562" }
            // { "Bib_ID": "b00149574", "Field": "082", "Indicator1": "0", "Indicator2": "4", "Subfield": "\a 005.133 \b ส826ก 2562" }
            // { "Bib_ID": "b00149574", "Field": "100", "Indicator1": "0", "Indicator2": "#", "Subfield": "\a สุพจน์ สง่ากอง." }
            // { "Bib_ID": "b00149574", "Field": "245", "Indicator1": "1", "Indicator2": "0", "Subfield": "\a การเขียนโปรแกรมภาษา Python / \c สุพจน์ สง่ากอง." }
            // { "Bib_ID": "b00149574", "Field": "250", "Indicator1": "#", "Indicator2": "#", "Subfield": "\a พิมพ์ครั้งที่ 1." }
            // { "Bib_ID": "b00149574", "Field": "260", "Indicator1": "#", "Indicator2": "#", "Subfield": "\a กรุงเทพฯ : \b รีไวว่า,\c 2562." }
            // { "Bib_ID": "b00149574", "Field": "300", "Indicator1": "#", "Indicator2": "#", "Subfield": "\a 216 หน้า : \b ภาพประกอบ, ตาราง ; \c 21 ซม" }
            // { "Bib_ID": "b00149574", "Field": "650", "Indicator1": "#", "Indicator2": "4", "Subfield": "\a การเขียนโปรแกรม (คอมพิวเตอร์)." }
            // { "Bib_ID": "b00149574", "Field": "650", "Indicator1": "#", "Indicator2": "4", "Subfield": "\a โปรแกรมคอมพิวเตอร์." },
            // { "Bib_ID": "b00149574", "Field": "650", "Indicator1": "#", "Indicator2": "4", "Subfield": "\a ไพธอน (ภาษาคอมพิวเตอร์)." }
            // { "Bib_ID": "b00149574", "Field": "650", "Indicator1": "#", "Indicator2": "4", "Subfield": "\a ภาษาคอมพิวเตอร์." }
            // res.json(ObjDataBib);
    } catch (e) {
        console.log(e);
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