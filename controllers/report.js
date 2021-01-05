const { borrowandreturn, databib_item, databib, allmembers } = require('../models');
const helper = require('../helper/stringHelper');

exports.borrowandreturn_of_User_datareport = async (req, res) => {
    try {
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
        if (datareport != '' && datareport != null && datareport != undefined) {
            for (const key in datareport) {
                datareport[key].nameBooks.Subfield = helper.subfReplaceToBlank(datareport[key].nameBooks.Subfield);
                if (datareport[key].ISBNs) {
                    datareport[key].ISBNs.Subfield = helper.subfReplaceToBlank(datareport[key].ISBNs.Subfield);
                }
            }
            res.json({
                Title: "รายงานข้อมูลสมาชิก",
                Member: member_ID,
                Total: amount,
                Data: datareport,
            });
        } else {
            res.json({ msg: 'Not Found DataReport' })
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
};

exports.borrowandreturn_datareport = async (req, res) => {
    try {
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
                Title: "รายงานสถิติข้อมูลการยืม-คืนหนังสือ",
                DateThai: helper.convdatethai(date),
                Total: amount,
                Data: datareport,
            });
        } else {
            res.json({ msg: 'Not Found DataReport' })
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
};

exports.notReturn_datareport = async (req, res) => {
    try {
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
                Title: "รายงานหนังสือค้างส่ง",
                DateThai: helper.convdatethai(date),
                Total: amount,
                Data: datareport,
            });
        } else {
            res.json({ msg: 'Not Found DataReport' })
        }

    } catch (e) {
        console.log(e);
        throw e;
    }
};

