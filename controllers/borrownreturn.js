const { borrowandreturn, databib_item, databib ,sequelize} = require('../models');
const helper = require('../helper/stringHelper');

exports.List_BorrowAndReturn_Data = async (req, res) => {
    try {
        const dataBnR = await borrowandreturn.findAll({
            attributes: ['Librarian_ID','Member_ID','Barcode','Borrow', 'Due','Returns'],
            include: [
                {
                    model: databib_item,
                    attributes: ['Barcode', 'item_status'],
                    required:false
                },
                {
                    model: databib,
                    attributes: ['Subfield'],
                    where: { Field: '245' },
                    required:false
                }
            ],
            where: {
                Member_ID: req.params.memid
            }
        }).then(out => res.json(out))
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

exports.create_BorrowAndReturn_Data = async (req, res) => {
    try {
        const { libid, memid, brcd, lbin, } = req.body;
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
                item_description: null
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
