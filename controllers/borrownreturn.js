const { borrowandreturn, databib_item, databib ,sequelize} = require('../models');

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
