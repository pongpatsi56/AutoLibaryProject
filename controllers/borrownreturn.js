const { borrowandreturn, databib_item, databib, sequelize, allmembers } = require('../models');
const { Op } = require('sequelize');
const helper = require('../helper/stringHelper');
const moment = require('moment');

exports.List_BorrowAndReturn_byUser = async (req, res) => {
    try {
        const dataBnR = await borrowandreturn.findAll({
            attributes: ['Librarian_ID', 'Member_ID', 'Barcode', 'Borrow', 'Due', 'Returns'],
            include: [
                {
                    model: databib_item,
                    attributes: ['Barcode', 'item_status'],
                    required: false
                },
                {
                    model: databib,
                    attributes: ['Subfield'],
                    where: { Field: '245' },
                    required: false
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

exports.List_data_User = async (req, res) => {
    try {
        await allmembers.findAll({
            attributes: ['member_ID','mem_Citizenid','FName', 'LName', 'Position'],
            where: {
                [Op.or]: [
                    {
                        member_ID: {
                            [Op.substring]: req.params.keyword
                        }
                    },
                    {
                        mem_Citizenid: {
                            [Op.substring]: req.params.keyword
                        }
                    },
                    {
                        FName: {
                            [Op.substring]: req.params.keyword
                        }
                    },
                    {
                        LName: {
                            [Op.substring]: req.params.keyword
                        }
                    }
                ]
            }
        }).then(out => res.json(out))
    } catch (e) {
        console.log(e);
    }
};

exports.List_All_BorrowandReturn_byLib = async (req, res) => {
    try {
        const dataBnR = await borrowandreturn.findAll({
            attributes: ['Librarian_ID', 'Member_ID', 'Barcode', 'Borrow', 'Due', 'Returns'],
            include: [
                {
                    model: databib_item,
                    attributes: ['Barcode', 'item_status'],
                    required: false
                },
                {
                    model: databib,
                    attributes: ['Subfield'],
                    where: { Field: '245' },
                    required: false
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

exports.create_Borrow_Data = async (req, res) => {
    try {
        const { libid, memid, brcd } = req.body;
        let datenow = moment().format('YYYY-MM-DD HH:mm:ss');
        let date7day = moment(datenow).add(7, 'days').format('YYYY-MM-DD');
        const getBibid = await databib_item.findOne({ attributes: ['Bib_ID'], where: { Barcode: brcd } });

        // res.send(`${libid, memid, brcd} :: ${datenow} :: ${date7day} :: ${getBibid['Bib_ID']}`);
        if (memid != null && memid != '' && brcd != null && brcd != '') {
            await borrowandreturn.create({
                Librarian_ID: libid,
                Member_ID: memid,
                Barcode: brcd,
                Borrow: datenow,
                item_in: datenow,
                Due: null,
                Returns: date7day,
                Bib_ID: getBibid['Bib_ID']
            }).then(rescreate => {
                databib_item.update(
                    { item_status: 'Not Available' },
                    { where: { Barcode: brcd } }
                ).then(resupdate => {
                    res.json({
                        status: 200,
                        Results: { 'CreateResult': rescreate, 'UpdateResult': resupdate },
                        msg: `Item ${brcd} Borrowed by ${memid}`
                    })
                })
            });
        } else {
            res.json({ msg: `Books or Member must not be Empty` });
        }

    } catch (error) {
        console.log('Error:', error);
        res.send(error);

    }
};

exports.update_Return_Data = async (req, res) => {
    try {
        const { brcd } = req.body;
        let datenow = moment().format('YYYY-MM-DD HH:mm:ss');
        if (brcd != null && brcd != '') {
            const updBnR = await borrowandreturn.update(
                { Due: datenow },
                { where: { Barcode: brcd } }
            );
            const updDBI = await databib_item.update(
                { item_status: 'Available' },
                { where: { Barcode: brcd } }
            );
            if (updBnR && updDBI) {
                res.json({
                    status: 200,
                    Results: { 'BorrownReturnResult': updBnR, 'DatabibItemResult': updDBI },
                    msg: `Item ${brcd} Borrowed by ${memid}`
                })
            } else { res.json({ msg: `Updating some mistakes.` }) }
        } else {
            res.json({ msg: `BAD REQUEST.` });
        }

    } catch (error) {
        console.log('Error:', error);
        res.send(error);

    }
};
