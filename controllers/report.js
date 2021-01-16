const { borrowandreturn, databib_item, databib, allmembers, sequelize } = require('../models');
const helper = require('../helper/stringHelper');
const { Op } = require('sequelize');
const moment = require('moment');
moment.locale('th');
process.env.TZ = 'Asia/Bangkok';

////////// รายงานข้อมูลการยืมของสมาชิก ///////////
exports.borrowandreturn_of_User_datareport = async (req, res) => {
    try {
        const title_report = "รายงานข้อมูลการยืมสมาชิก";
        const member_ID = req.body.member_ID;
        var datareport = await borrowandreturn.findAll({
            include: [
                {
                    model: databib_item,
                    attributes: ['Barcode', 'item_status'],
                    required: false
                },
                {
                    model: allmembers, as: 'librariannames',
                    attributes: ['FName', 'LName'],
                    required: false
                },
                {
                    model: allmembers, as: 'membernames',
                    attributes: ['FName', 'LName'],
                    required: false
                },
                {
                    model: databib, as: 'nameBooks',
                    attributes: ['Subfield'],
                    where: { Field: '245' },
                    required: false
                },
                {
                    model: databib, as: 'ISBNs',
                    attributes: ['Subfield'],
                    where: { Field: '020' },
                    required: false
                }
            ],
            where: {
                member_ID: member_ID
            }
        });
        let amount = 0;
        if (datareport != "" && datareport != null && datareport != undefined) {
          for (const key in datareport) {
            datareport[key].dataValues.databib_item = datareport[key].databib_item.Barcode;
            datareport[key].dataValues.librariannames = datareport[key].librariannames.FName + " " + datareport[key].librariannames.FName;
            datareport[key].dataValues.membernames = datareport[key].membernames.FName + " " + datareport[key].membernames.FName;
            datareport[key].dataValues.ISBNs = (datareport[key].ISBNs) ? helper.subfReplaceToBlank(datareport[key].ISBNs.Subfield) : '-';
            datareport[key].dataValues.nameBooks = helper.subfReplaceToBlank(datareport[key].dataValues.nameBooks.Subfield);
            datareport[key].dataValues.Borrow= moment(datareport[key].Borrow).format('ll');
            datareport[key].dataValues.Due= moment(datareport[key].Due).format('ll');
            datareport[key].dataValues.Returns= moment(datareport[key].Returns).format('ll');
            amount++
          }
          res.json({
            Title: title_report,
            DateThai: moment(date).format('LL'),
            Member: member_ID,
            Total: amount,
            Data: datareport,
          });
        } else {
          res.json({
            Title: title_report,
            DateThai: moment(date).format('LL'),
            Total: amount,
            Data: "ไม่พบข้อมูล" + title_report,
          });
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
};

////// รายงานข้อมูลหนังสือ ////////


//////// รายงานหนังสือค้างส่ง /////////
exports.notReturn_datareport = async (req, res) => {
    try {
        const title_report = "รายงานหนังสือค้างส่ง";
        const startDate = moment(req.body.startDate).format('YYYY-MM-DD');
        const endDate = moment(req.body.endDate).format('YYYY-MM-DD');
        var datareport = await borrowandreturn.sequelize.query(
            'SELECT `borrowandreturn`.`bnr_ID`, `borrowandreturn`.`Librarian_ID`, `borrowandreturn`.`Member_ID`, `borrowandreturn`.`Barcode`, `borrowandreturn`.`Bib_ID`, `borrowandreturn`.`Borrow`, `borrowandreturn`.`Due`, `borrowandreturn`.`Returns`, `borrowandreturn`.`createdAt`, `borrowandreturn`.`updatedAt`,`databib_item`.`Barcode` AS `Barcode`,CONCAT(`librariannames`.`FName`," ",`librariannames`.`LName`) AS `librariannames`,CONCAT(`membernames`.`FName`," ",`membernames`.`LName`) AS `membernames`,`nameBooks`.`Subfield` AS `nameBooks`, `ISBNs`.`Subfield` AS `ISBNs`FROM `borrowandreturns` AS `borrowandreturn` LEFT OUTER JOIN `databib_items` AS `databib_item` ON `borrowandreturn`.`Barcode` = `databib_item`.`Barcode` LEFT OUTER JOIN `allmembers` AS `librariannames` ON `borrowandreturn`.`Librarian_ID` = `librariannames`.`member_ID` LEFT OUTER JOIN `allmembers` AS `membernames` ON `borrowandreturn`.`Member_ID` = `membernames`.`member_ID` LEFT OUTER JOIN `databibs` AS `nameBooks` ON `borrowandreturn`.`Bib_ID` = `nameBooks`.`Bib_ID` AND `nameBooks`.`Field` = "245" LEFT OUTER JOIN `databibs` AS `ISBNs` ON `borrowandreturn`.`Bib_ID` = `ISBNs`.`Bib_ID` AND `ISBNs`.`Field` = "020" WHERE `borrowandreturn`.`Due` IS NULL AND DATE(`borrowandreturn`.`Borrow`) BETWEEN "' + startDate + '" AND "' + endDate + '"',
            { type: borrowandreturn.sequelize.QueryTypes.SELECT }
        )
        let amount = 0;
        if (datareport != '' && datareport != null && datareport != undefined) {
            for (const key in datareport) {
                datareport[key].nameBooks = helper.subfReplaceToBlank(datareport[key].nameBooks);
                datareport[key].ISBNs = (datareport[key].ISBNs) ? helper.subfReplaceToBlank(datareport[key].ISBNs) : '-';
                datareport[key].Borrow= moment(datareport[key].Borrow).format('ll');
                datareport[key].Due= moment(datareport[key].Due).format('ll');
                datareport[key].Returns= moment(datareport[key].Returns).format('ll');
                amount++;
            }
            res.json({
                Title: title_report,
                DateThai: moment(startDate).format('LL') + ' ถึง ' + moment(endDate).format('LL'),
                Total: amount,
                Data: datareport,
            });
        } else {
            res.json({
                Title: title_report,
                DateThai: moment(startDate).format('LL') + ' ถึง ' + moment(endDate).format('LL'),
                Total: amount,
                Data: 'ไม่พบข้อมูล' + title_report,
                })
        }

    } catch (e) {
        console.log(e);
        throw e;
    }
};

////// รายงานสถิติข้อมูลการยืม-คืนหนังสือ ////////
exports.borrowandreturn_datareport = async (req, res) => {
    try {
        const title_report = "รายงานสถิติข้อมูลการยืม-คืนหนังสือ";
        const startDate = new Date(req.body.startDate)
        const endDate = new Date(req.body.endDate)
        var datareport = await borrowandreturn.findAll({
            include: [
                {
                    model: databib_item,
                    attributes: ['Barcode', 'item_status'],
                    required: false
                },
                {
                    model: allmembers, as: 'librariannames',
                    attributes: ['FName', 'LName'],
                    required: false
                },
                {
                    model: allmembers, as: 'membernames',
                    attributes: ['FName', 'LName'],
                    required: false
                },
                {
                    model: databib, as: 'nameBooks',
                    attributes: ['Subfield'],
                    where: { Field: '245' },
                    required: false
                },
                {
                    model: databib, as: 'ISBNs',
                    attributes: ['Subfield'],
                    where: { Field: '020' },
                    required: false
                }
            ],
            where: {
                Borrow: {
                    [Op.between]: [startDate, endDate]
                }
                // Borrow: date
            }
        });
        var amount = 0;
        if (datareport != '' && datareport != null && datareport != undefined) {
            for (const key in datareport) {
                datareport[key].dataValues.databib_item = datareport[key].databib_item.Barcode;
                datareport[key].dataValues.librariannames = datareport[key].librariannames.FName + " " + datareport[key].librariannames.FName;
                datareport[key].dataValues.membernames = datareport[key].membernames.FName + " " + datareport[key].membernames.FName;
                datareport[key].dataValues.nameBooks = helper.subfReplaceToBlank(datareport[key].nameBooks.Subfield);
                datareport[key].dataValues.ISBNs = (datareport[key].ISBNs) ? helper.subfReplaceToBlank(datareport[key].ISBNs.Subfield) : '-';
                datareport[key].dataValues.Borrow= moment(datareport[key].Borrow).format('ll');
                datareport[key].dataValues.Due= moment(datareport[key].Due).format('ll');
                datareport[key].dataValues.Returns= moment(datareport[key].Returns).format('ll');
                amount++;
            }
            res.json({
                Title: title_report,
                DateThai: moment(startDate).format('LL') + ' ถึง ' + moment(endDate).format('LL'),
                Total: amount,
                Data: datareport,
            });
        } else {
            res.json({
                Title: title_report,
                DateThai: moment(startDate).format('LL') + ' ถึง ' + moment(endDate).format('LL'),
                Total: amount,
                Data: 'ไม่พบข้อมูล' + title_report
            })
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
};

////// รายงานสถิติการเข้าใช้ห้องสมุด ////////


////// รายงานค่าปรับ ////////
exports.Fine_receipt_datareport = async (req, res) => {
    try {
        const title_report = "รายงานค่าปรับ";
        const startDate = moment(req.body.startDate).format('YYYY-MM-DD');
        const endDate = moment(req.body.endDate).format('YYYY-MM-DD');
        var datareport = await sequelize.query(
            'SELECT `receipt_ID`, `bnr_ID`, `receipt_NO`, `Amount`, `fine_type`, `IsPaid`, `Description`, `createdAt`, `updatedAt` FROM `fine_reciepts` AS `fine_reciept` WHERE DATE(`fine_reciept`.`createdAt`) BETWEEN "' + startDate + '" AND "' + endDate + '"',
            { type: sequelize.QueryTypes.SELECT }
        )
        let amount = 0;
        if (datareport != '' && datareport != null && datareport != undefined) {
            for (const key in datareport) {
                datareport[key].receipt_NO = (datareport[key].receipt_NO) ? datareport[key].receipt_NO : '-';
                datareport[key].Description = (datareport[key].Description) ? datareport[key].Description : '-';
                datareport[key].createdAt= moment(datareport[key].createdAt).format('ll');
                datareport[key].Amount= datareport[key].Amount + ' บาท';
                amount++;
            }
            res.json({
                Title: title_report,
                DateThai: moment(startDate).format('LL') + ' ถึง ' + moment(endDate).format('LL'),
                Total: amount,
                Data: datareport,
            });
        } else {
            res.json({
                Title: title_report,
                DateThai: moment(startDate).format('LL') + ' ถึง ' + moment(endDate).format('LL'),
                Total: amount,
                Data: 'ไม่พบข้อมูล' + title_report,
                })
        }

    } catch (e) {
        console.log(e);
        throw e;
    }
};

////// รายงานการตัดจำหน่ายหนังสือ ////////
exports.bibitem_description = async (req,res)=>{
    const title_report = "รายงานการตัดจำหน่ายหนังสือ";
    const startDate = moment(req.body.startDate).format('YYYY-MM-DD');
    const endDate = moment(req.body.endDate).format('YYYY-MM-DD');
    try {
    var datareport = await sequelize.query(
                "SELECT `databib_item`.`Bib_ID`,`databib_item`.`Barcode`,`databib_item`.`Copy`,`databib_item`.`item_status`,`databib_item`.`item_in`,`databib_item`.`item_out`,CONCAT(`allmember`.`FName`,' ',`allmember`.`LName`) AS `librariannames`,`databib_item`.`item_description`,`databib`.`Subfield` AS `namebooks` FROM `databib_items` AS `databib_item` LEFT OUTER JOIN `allmembers` AS  `allmember` ON `allmember`.`member_ID` = `databib_item`.`libid_getitemin` LEFT OUTER JOIN `databibs` AS `databib` ON `databib_item`.`Bib_ID` = `databib`.`Bib_ID` AND `databib`.`Field` = '245' WHERE  `databib_item`.`item_in` BETWEEN '" + startDate + "' AND '" + endDate + "'",
                { type: sequelize.QueryTypes.SELECT }
        )
        let amount = 0;
    if ( datareport != 0 ) {
            datareport.map((data) => {
                data.namebooks = helper.subfReplaceToBlank(data.namebooks);
                if (data.item_description) {
                    if (data.item_description.indexOf('||') !== -1) {
                        var desc_in = (data.item_description.split('||')[0]) ? data.item_description.split('||')[0] : '-';
                        var desc_out = (data.item_description.split('||')[1]) ? data.item_description.split('||')[1] : '-';
                        Object.assign(data, { 'desc_in': desc_in,'desc_out': desc_out });
                    }else{
                        Object.assign(data, { 'desc_in': data.item_description,'desc_out': '-' });
                    }
                }else{
                    data.item_description = '-'
                    Object.assign(data, { 'desc_in': '-','desc_out': '-' });
                }
                data.item_in= moment(data.item_in).format('ll');
                data.item_out= moment(data.item_out).format('ll');
            });
            res.json({
                Title: title_report,
                DateThai: moment(startDate).format('LL') + ' ถึง ' + moment(endDate).format('LL'),
                Total: amount,
                Data: datareport,
            });
    } else {
            res.json({
                Title: title_report,
                DateThai: moment(startDate).format('LL') + ' ถึง ' + moment(endDate).format('LL'),
                Total: amount,
                Data: 'ไม่พบข้อมูล' + title_report,
                    })
    }
     } catch (e) {
            console.log(e);
    }
}