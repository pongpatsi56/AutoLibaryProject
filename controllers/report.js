const { borrowandreturn, databib_item, databib, allmembers } = require('../models');
const helper = require('../helper/stringHelper');
const { Op } = require('sequelize');
const moment = require('moment');
moment.locale('th');
process.env.TZ = 'Asia/Calcutta';

////////// รายงานข้อมูลการยืมสมาชิก ///////////
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
            datareport[key].dataValues.membernames = datareport[key].membernames.FName + " " + datareport[key].membernames.FName;;
            datareport[key].dataValues.ISBNs = (datareport[key].ISBNs) ? helper.subfReplaceToBlank(datareport[key].ISBNs.Subfield) : '-';
            datareport[key].dataValues.nameBooks = helper.subfReplaceToBlank(datareport[key].dataValues.nameBooks.Subfield);
            datareport[key].dataValues.Borrow= moment(datareport[key].Borrow).format('ll');
            datareport[key].dataValues.Due= moment(datareport[key].Due).format('ll');
            datareport[key].dataValues.Returns= moment(datareport[key].Returns).format('ll');
            amount++
          }
          res.json({
            Title: title_report,
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

////// รายงานขอหนังสือ ////////


//////// รายงานหนังสือค้างส่ง /////////
exports.notReturn_datareport = async (req, res) => {
    try {
        const title_report = "รายงานหนังสือค้างส่ง";
        const date = moment(req.body.date).format('YYYY-MM-DD');
        const datet = new Date(date);
        console.log(date);
        console.log(datet);
        var datareport = await borrowandreturn.sequelize.query(
            'SELECT `borrowandreturn`.`bnr_ID`, `borrowandreturn`.`Librarian_ID`, `borrowandreturn`.`Member_ID`, `borrowandreturn`.`Barcode`, `borrowandreturn`.`Bib_ID`, `borrowandreturn`.`Borrow`, `borrowandreturn`.`Due`, `borrowandreturn`.`Returns`, `borrowandreturn`.`createdAt`, `borrowandreturn`.`updatedAt`,`databib_item`.`Barcode` AS `Barcode`,CONCAT(`librariannames`.`FName`," ",`librariannames`.`LName`) AS `librariannames`,CONCAT(`membernames`.`FName`," ",`membernames`.`LName`) AS `membernames`,`nameBooks`.`Subfield` AS `nameBooks`, `ISBNs`.`Subfield` AS `ISBNs`FROM `borrowandreturns` AS `borrowandreturn` LEFT OUTER JOIN `databib_items` AS `databib_item` ON `borrowandreturn`.`Barcode` = `databib_item`.`Barcode` LEFT OUTER JOIN `allmembers` AS `librariannames` ON `borrowandreturn`.`Librarian_ID` = `librariannames`.`member_ID` LEFT OUTER JOIN `allmembers` AS `membernames` ON `borrowandreturn`.`Member_ID` = `membernames`.`member_ID` LEFT OUTER JOIN `databibs` AS `nameBooks` ON `borrowandreturn`.`Bib_ID` = `nameBooks`.`Bib_ID` AND `nameBooks`.`Field` = "245" LEFT OUTER JOIN `databibs` AS `ISBNs` ON `borrowandreturn`.`Bib_ID` = `ISBNs`.`Bib_ID` AND `ISBNs`.`Field` = "020" WHERE `borrowandreturn`.`Due` IS NULL AND DATE(`borrowandreturn`.`Borrow`) ="' + date + '"',
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
                DateThai: moment(datet).format('LL'),
                Total: amount,
                Data: datareport,
            });
        } else {
            res.json({
                Title: title_report,
                DateThai: moment(datet).format('LL'),
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
        const date = new Date(req.body.date)
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
                Borrow: date
            }
        });
        const amount = await borrowandreturn.count({
            where: {
                Borrow: date
            }
        });
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
            }
            res.json({
                Title: title_report,
                DateThai: moment(date).format('LL'),
                Total: amount,
                Data: datareport,
            });
        } else {
            res.json({
                Title: title_report,
                DateThai: moment(date).format('LL'),
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

////// รายงานการตัดจำหน่ายหนังสือ ////////
