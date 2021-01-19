const { borrowandreturn, databib_item, databib, allmembers, sequelize } = require('../models');
const helper = require('../helper/stringHelper');
const { Op, where } = require('sequelize');
const moment = require('moment');
moment.locale('th');
process.env.TZ = 'Asia/Bangkok';

////////// รายงานข้อมูลการยืมของสมาชิก ///////////
exports.borrowandreturn_of_User_datareport = async (req, res) => {
    try {
        const title_report = "รายงานข้อมูลการยืมสมาชิก";
        const member_ID = req.body.member_ID;
        const date = new Date();
        const MemInfo = await allmembers.findOne({where: { Member_ID: member_ID }});
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
            datareport[key].dataValues.librariannames = datareport[key].librariannames.FName + " " + datareport[key].librariannames.LName;
            datareport[key].dataValues.membernames = datareport[key].membernames.FName + " " + datareport[key].membernames.LName;
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
            Member: MemInfo.FName + ' ' + MemInfo.LName,
            Total: amount + " รายการ",
            Data: datareport,
          });
        } else {
          res.json({
            Title: title_report,
            DateThai: moment(date).format('LL'),
            Member: MemInfo.FName + ' ' + MemInfo.LName,
            Total: amount + " รายการ",
            Data: "ไม่พบข้อมูล" + title_report,
          });
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
};

////// รายงานข้อมูลหนังสือ ////////
exports.bibliography_datareport = async (req, res) => {
    try {
        const title_report = "รายงานข้อมูลหนังสือ";
        const startDate = moment(req.body.startDate).format('YYYY-MM-DD');
        const endDate = moment(req.body.endDate).format('YYYY-MM-DD');
        var datareport = await sequelize.query(
            'SELECT `borrowandreturn`.`bnr_ID`, `borrowandreturn`.`Librarian_ID`, `borrowandreturn`.`Member_ID`, `borrowandreturn`.`Barcode`, `borrowandreturn`.`Bib_ID`, `borrowandreturn`.`Borrow`, `borrowandreturn`.`Due`, `borrowandreturn`.`Returns`, `borrowandreturn`.`createdAt`, `borrowandreturn`.`updatedAt`,`databib_item`.`Barcode` AS `Barcode`,CONCAT(`librariannames`.`FName`," ",`librariannames`.`LName`) AS `librariannames`,CONCAT(`membernames`.`FName`," ",`membernames`.`LName`) AS `membernames`,`nameBooks`.`Subfield` AS `nameBooks`, `ISBNs`.`Subfield` AS `ISBNs`FROM `borrowandreturns` AS `borrowandreturn` LEFT OUTER JOIN `databib_items` AS `databib_item` ON `borrowandreturn`.`Barcode` = `databib_item`.`Barcode` LEFT OUTER JOIN `allmembers` AS `librariannames` ON `borrowandreturn`.`Librarian_ID` = `librariannames`.`member_ID` LEFT OUTER JOIN `allmembers` AS `membernames` ON `borrowandreturn`.`Member_ID` = `membernames`.`member_ID` LEFT OUTER JOIN `databibs` AS `nameBooks` ON `borrowandreturn`.`Bib_ID` = `nameBooks`.`Bib_ID` AND `nameBooks`.`Field` = "245" LEFT OUTER JOIN `databibs` AS `ISBNs` ON `borrowandreturn`.`Bib_ID` = `ISBNs`.`Bib_ID` AND `ISBNs`.`Field` = "020" WHERE DATE(`borrowandreturn`.`Borrow`) BETWEEN "' + startDate + '" AND "' + endDate + '"',
            { type: sequelize.QueryTypes.SELECT }
        )
        let amount = 0;
        if (datareport != '' && datareport != null && datareport != undefined) {
            for (const key in datareport) {
                datareport[key].nameBooks = helper.subfReplaceToBlank(datareport[key].nameBooks);
                datareport[key].ISBNs = (datareport[key].ISBNs) ? helper.subfReplaceToBlank(datareport[key].ISBNs) : '-';
                datareport[key].Borrow= moment(datareport[key].Borrow).format('ll');
                datareport[key].Due= (datareport[key].Due) ? moment(datareport[key].Due).format('ll') : '-';
                datareport[key].Returns= moment(datareport[key].Returns).format('ll');
                amount++;
            }
            res.json({
                Title: title_report,
                DateThai: moment(startDate).format('LL') + ' ถึง ' + moment(endDate).format('LL'),
                Total: amount + " รายการ",
                Data: datareport,
            });
        } else {
            res.json({
                Title: title_report,
                DateThai: moment(startDate).format('LL') + ' ถึง ' + moment(endDate).format('LL'),
                Total: amount + " รายการ",
                Data: 'ไม่พบข้อมูล' + title_report,
                })
        }

    } catch (e) {
        console.log(e);
        throw e;
    }
};

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
                datareport[key].Borrow = moment(datareport[key].Borrow).format('ll');
                datareport[key].Due = (datareport[key].Due) ? moment(datareport[key].Due).format('ll') : '-';
                datareport[key].Returns = moment(datareport[key].Returns).format('ll');
                amount++;
            }
            res.json({
                Title: title_report,
                DateThai: moment(startDate).format('LL') + ' ถึง ' + moment(endDate).format('LL'),
                Total: amount + " รายการ",
                Data: datareport,
            });
        } else {
            res.json({
                Title: title_report,
                DateThai: moment(startDate).format('LL') + ' ถึง ' + moment(endDate).format('LL'),
                Total: amount + " รายการ",
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
                Total: amount + " รายการ",
                Data: datareport,
            });
        } else {
            res.json({
                Title: title_report,
                DateThai: moment(startDate).format('LL') + ' ถึง ' + moment(endDate).format('LL'),
                Total: amount + " รายการ",
                Data: 'ไม่พบข้อมูล' + title_report
            })
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
};

////// รายงานสถิติการเข้าใช้ห้องสมุด ////////
exports.statistic_borrowandreturn_datareport = async (req, res) => {
    try {
        const title_report = "รายงานสถิติการเข้าใช้ห้องสมุด";
        const arrDays = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
        const arrMonth = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
        const reqDate = new Date(req.body.Date);
        const MonthDate = new Date(req.body.Date).getMonth() + 1;
        const YearDate = new Date(req.body.Date).getFullYear();
        const countTotal = await sequelize.query("SELECT COUNT(*) AS Total FROM `borrowandreturns` WHERE MONTH(`borrowandreturns`.`Borrow`) =  '" + MonthDate + "' AND YEAR(`borrowandreturns`.`Borrow`) =  '" + YearDate + "'",{ type: sequelize.QueryTypes.SELECT })
        var WeekofMonth_datareport = await sequelize.query(
            "SELECT COUNT(*) AS Total_ListOfWeek, FLOOR((DayOfMonth(`borrowandreturns`.`Borrow`)-1)/7)+1 AS NAMEWEEK FROM  `borrowandreturns` WHERE  MONTH(`borrowandreturns`.`Borrow`) =  '" + MonthDate + "' AND YEAR(`borrowandreturns`.`Borrow`) =  '" + YearDate + "' GROUP BY NAMEWEEK",
            { type: sequelize.QueryTypes.SELECT }).then(WeekData=>{
                var  ObjWoM = {};
                for (let i = 0; i < 5 ; i++) {
                    const datares = WeekData.filter(val => val.NAMEWEEK == i)
                    if (datares != '') {
                        Object.assign(ObjWoM,{["WEEK" + datares[0].NAMEWEEK]: datares[0].Total_ListOfWeek})                     
                    } else {
                        Object.assign(ObjWoM,{["WEEK" + (i + 1) ]: '-'})            
                    }
                }
                return ObjWoM;
            })
        var DayofWeek_datareport = await sequelize.query(
            "SELECT COUNT(*) AS Total_ListofDay, WEEKDAY(`borrowandreturns`.`Borrow`) + 1 AS NAMEDAY FROM  `borrowandreturns` WHERE  MONTH(`borrowandreturns`.`Borrow`) =  '" + MonthDate + "' AND YEAR(`borrowandreturns`.`Borrow`) =  '" + YearDate + "' GROUP BY NAMEDAY",
            { type: sequelize.QueryTypes.SELECT }).then(DaysData=>{
                var  ObjDoF = {};
                for (let i = 1; i < 8 ; i++) {
                    const datares = DaysData.filter(val => val.NAMEDAY == i)
                    if (datares != '') {
                            Object.assign(ObjDoF,{[arrDays[datares[0].NAMEDAY - 1]]: datares[0].Total_ListofDay})
                    } 
                    else {
                        Object.assign(ObjDoF,{[arrDays[i - 1]]: '-'})            
                    }
                }
                // DaysData.map(value=>{
                //     value.NAMEDAY = arrDays[value.NAMEDAY - 1];
                // })
                return ObjDoF;
            })
        var MonthofYear_datareport = await sequelize.query(
            "SELECT COUNT(*) AS Total_ListOfMonth, " + MonthDate + " AS NAMEMONTH FROM  `borrowandreturns` WHERE  MONTH(`borrowandreturns`.`Borrow`) =  '" + MonthDate + "' AND YEAR(`borrowandreturns`.`Borrow`) =  '" + YearDate + "' GROUP BY NAMEMONTH",
            { type: sequelize.QueryTypes.SELECT }).then(MonthData=>{
                var  ObjMoY = {};
                MonthData.map(value=>{
                    Object.assign(ObjMoY,{[arrMonth[value.NAMEMONTH - 1]]: value.Total_ListOfMonth})
                })
                return ObjMoY;
            })
        if (WeekofMonth_datareport != '' && DayofWeek_datareport != '' && MonthofYear_datareport != '') {
            res.json({
                Title: title_report,
                DateThai: moment(reqDate).format("MMM YYYY"),
                Total: countTotal[0].Total + " รายการ",
                Data: [[WeekofMonth_datareport],[DayofWeek_datareport],[MonthofYear_datareport]]
            });
        } else {
            res.json({
                Title: title_report,
                Total: countTotal[0].Total + " รายการ",
                DateThai: moment(reqDate).format("MMM YYYY"),
                Data: 'ไม่พบข้อมูล' + title_report
            })
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
};

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
                Total: amount + " รายการ",
                Data: datareport,
            });
        } else {
            res.json({
                Title: title_report,
                DateThai: moment(startDate).format('LL') + ' ถึง ' + moment(endDate).format('LL'),
                Total: amount + " รายการ",
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
    try {
    const title_report = "รายงานการตัดจำหน่ายหนังสือ";
    const startDate = moment(req.body.startDate).format('YYYY-MM-DD');
    const endDate = moment(req.body.endDate).format('YYYY-MM-DD');
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
                data.item_in = moment(data.item_in).format('ll');
                data.item_out = (data.item_out) ? moment(data.item_out).format('ll') : '-';
                amount++
            });
            res.json({
                Title: title_report,
                DateThai: moment(startDate).format('LL') + ' ถึง ' + moment(endDate).format('LL'),
                Total: amount + " รายการ",
                Data: datareport,
            });
    } else {
            res.json({
                Title: title_report,
                DateThai: moment(startDate).format('LL') + ' ถึง ' + moment(endDate).format('LL'),
                Total: amount + " รายการ",
                Data: 'ไม่พบข้อมูล' + title_report,
                    })
    }
     } catch (e) {
            console.log(e);
    }
}