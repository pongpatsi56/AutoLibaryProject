const { borrowandreturn, databib_item, databib, allmembers } = require('../models');
const helper = require('../helper/stringHelper');

////////// รายงานข้อมูลสมาชิก ///////////
exports.borrowandreturn_of_User_datareport = async (req, res) => {
    try {
        const title_report = "รายงานข้อมูลสมาชิก";
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
        const amount = await borrowandreturn.count({
            where: {
                member_ID: member_ID
            }
        });
        if (datareport != "" && datareport != null && datareport != undefined) {
          for (const key in datareport) {
            datareport[key].nameBooks.Subfield = helper.subfReplaceToBlank(
              datareport[key].nameBooks.Subfield
            );
            if (datareport[key].ISBNs) {
              datareport[key].ISBNs.Subfield = helper.subfReplaceToBlank(
                datareport[key].ISBNs.Subfield
              );
            }
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
            DateThai: helper.convdatethai(date),
            Total: amount,
            Data: "ไม่พบข้อมูล" + title_report,
          });
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
                datareport[key].nameBooks.Subfield = helper.subfReplaceToBlank(datareport[key].nameBooks.Subfield);
                if (datareport[key].ISBNs) {
                    datareport[key].ISBNs.Subfield = helper.subfReplaceToBlank(datareport[key].ISBNs.Subfield);
                }
            }
            res.json({
                Title: title_report,
                DateThai: helper.convdatethai(date),
                Total: amount,
                Data: datareport,
            });
        } else {
            res.json({
                Title: title_report,
                DateThai: helper.convdatethai(date),
                Total: amount,
                Data: 'ไม่พบข้อมูล' + title_report
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
                Due: null,
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
                datareport[key].nameBooks.Subfield = helper.subfReplaceToBlank(datareport[key].nameBooks.Subfield);
                if (datareport[key].ISBNs) {
                    datareport[key].ISBNs.Subfield = helper.subfReplaceToBlank(datareport[key].ISBNs.Subfield);
                }
            }
            res.json({
                Title: title_report,
                DateThai: helper.convdatethai(date),
                Total: amount,
                Data: datareport,
            });
        } else {
            res.json({
                Title: title_report,
                DateThai: helper.convdatethai(date),
                Total: amount,
                Data: 'ไม่พบข้อมูล' + title_report,
                })
        }

    } catch (e) {
        console.log(e);
        throw e;
    }
};

