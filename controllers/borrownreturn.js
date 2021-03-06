const { borrowandreturn, databib_item, databib, fine_reciept, allmembers } = require('../models');
const { Op } = require('sequelize');
const helper = require('../helper/stringHelper');
const moment = require('moment');
const invno = require('invoice-number');
moment.locale('th');

exports.List_All_BorrowandReturn = async (req, res) => {
    try {
        const datenow = moment();
        const DataResults = {};
        //////////////// ประวัติการยืม/คืนหนังสือ ///////////////////
        const dataBnR = await borrowandreturn.findAll({
            attributes: ['Librarian_ID', 'Member_ID', 'Barcode', 'Borrow', 'Due', 'Returns'],
            include: [
                {
                    model: databib_item,
                    attributes: ['Barcode', 'item_status'],
                    required: false
                },
                {
                    model: databib, as: 'nameBooks',
                    attributes: ['Subfield'],
                    where: { Field: '245' },
                    required: false
                }
            ],
            where: {
                [Op.and]: [
                    {
                        Member_ID: req.params.memid

                    },
                    {
                        Due: {
                            [Op.not]: null
                        }
                    }
                ]
            }
        }).then(dbnr => {
            if (dbnr != '') {
                dbnr.map((data) => {
                    data.dataValues.Borrow= moment(data.Borrow).format('ll');
                    data.dataValues.Due= moment(data.Due).format('ll');
                    data.dataValues.Returns= moment(data.Returns).format('ll');
                    data.dataValues.nameBooks= helper.subfReplaceToBlank(data.nameBooks.Subfield);
                    data.dataValues.databib_item = data.databib_item.item_status;
                });
                Object.assign(DataResults, { 'bnr_history': dbnr })
            } else {
                DataResults.bnr_history = "ไม่พบประวัติการยืม"
            }
        });

        ///////////////หนังสือค้าง///////////////////////
        const databorrow = await borrowandreturn.findAll({
            attributes: ['Librarian_ID', 'Member_ID', 'Barcode', 'Borrow', 'Due', 'Returns'],
            include: [
                {
                    model: databib_item,
                    attributes: ['Barcode', 'item_status'],
                    required: false
                },
                {
                    model: databib, as: 'nameBooks',
                    attributes: ['Subfield'],
                    where: { Field: '245' },
                    required: false
                }
            ],
            where: {
                [Op.and]: [
                    {
                        Member_ID: req.params.memid

                    },
                    {
                        Due: {
                            [Op.is]: null
                        }
                    }
                ]
            },
            order:[['Borrow','DESC']]
        }).then(dborw => {
            if (dborw != '') {
                dborw.map((data) => {
                    data.dataValues.datediff = datenow.diff(moment(data.Returns), 'days') > 0 ? datenow.diff(moment(data.Returns), 'days') +' วัน' : "ยังไม่เกินกำหนด";
                    data.dataValues.Borrow= moment(data.Borrow).format('ll');
                    data.dataValues.Returns= moment(data.Returns).format('ll');
                    data.dataValues.nameBooks= helper.subfReplaceToBlank(data.nameBooks.Subfield);
                    data.dataValues.databib_item = data.databib_item.item_status;
                });
                Object.assign(DataResults, { 'databorrow': dborw });
            } else {
                DataResults.databorrow = "ไม่พบรายการหนังสือคงค้าง"
            }
        });

        ///////////////////// ค่าปรับค้าง /////////////////////////
        await fine_reciept.sequelize.query(
            " SELECT `fine_reciept`.`receipt_ID`,`fine_reciept`.`bnr_ID`,`borrowandreturn`.`Due`,`borrowandreturn`.`Due`,`borrowandreturn`.`Returns`,`fine_reciept`.`receipt_NO`,`fine_reciept`.`Amount` ,`fine_reciept`.`fine_type` ,`fine_reciept`.`IsPaid`,`fine_reciept`.`fine_type` ,`fine_reciept`.`Description` ,`databib`.`Subfield` AS `namebooks` FROM `fine_reciepts` AS `fine_reciept` LEFT OUTER JOIN `borrowandreturns` AS `borrowandreturn` ON `fine_reciept`.`bnr_ID` = `borrowandreturn`.`bnr_ID` LEFT OUTER JOIN `databibs` AS `databib` ON `borrowandreturn`.`Bib_ID` = `databib`.`Bib_ID` AND `databib`.`Field` = '245'  WHERE (`borrowandreturn`.`Member_ID` = '" + req.params.memid + "') ORDER BY `borrowandreturn`.`Returns` DESC",
            { type: fine_reciept.sequelize.QueryTypes.SELECT }
        ).then((dfin) => {
            if (dfin != '') {
                dfin.map((data) => {
                    data.namebooks = helper.subfReplaceToBlank(data.namebooks);
                    Object.assign(data, { 'datediff': moment(data.Due).diff(moment(data.Returns), 'days') + ' วัน'});
                    data.Due= moment(data.Due).format('ll');
                    data.Returns= moment(data.Returns).format('ll');
                    data.Amount= data.Amount +' บาท';
                });
                Object.assign(DataResults, { 'finebooks': dfin });
            } else {
                DataResults.finebooks = "ไม่พบรายการค่าปรับคงค้าง"
            }
        })
        // console.log(DataResults);
        res.json(DataResults)

    } catch (e) {
        console.log(e);
        throw e;
    }
};

exports.List_data_User = async (req, res) => {
    try {
        await allmembers.findAll({
            attributes: ['member_ID', 'mem_Citizenid', 'FName', 'LName', 'Position'],
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

exports.List_itemBooktoBorrow = (req, res) => {
    try {
        databib_item.sequelize.query(
            "SELECT `databib_item`.`Barcode`, `databib_item`.`Bib_ID`, `databib_item`.`Copy`, `databib_item`.`Item_status`, `databib_item`.`item_description`,REPLACE (REPLACE (REPLACE (REPLACE (REPLACE (REPLACE (REPLACE (`databibs`.`Subfield`,'$a',''),'$b',''),'$c',''),'$e',''),'$f',''),'$g',''),'$h','') AS `namebooks` FROM `databib_items` AS `databib_item` LEFT OUTER JOIN `databibs` AS `databibs` ON `databib_item`.`Bib_ID` = `databibs`.`Bib_ID` AND `databibs`.`Field` = '245' WHERE `databib_item`.`Barcode` ='" + req.params.brcd + "'",
            { type: databib_item.sequelize.QueryTypes.SELECT }
        ).then((out) => {
            let datenow = moment().format('YYYY-MM-DD HH:mm:ss');
            let date7day = moment(datenow).add(7, 'days').format('YYYY-MM-DD');
            out[0] = {...out[0],"Borrow_send":datenow,"Returns_send":date7day}
            res.send(out);
        })
    } catch (e) {
        console.log(e);
    }
};

exports.create_Borrow_Data = async (req, res) => {
    try {
        let datenow = moment().format('YYYY-MM-DD HH:mm:ss');
        const resObjBody = req.body.databorrow;
        if (resObjBody && resObjBody != null && resObjBody != '') {
            for (const key in resObjBody) {
                const getBibid = await databib_item.findOne({ attributes: ['Bib_ID'], where: { Barcode: resObjBody[key]['Barcode'] } });
                await databib_item.update({ item_status: 'Not Available' },{ where: { Barcode: resObjBody[key]['Barcode'] } });
                Object.assign(resObjBody[key], { "item_in": datenow,"Due": null,"Bib_ID": getBibid['Bib_ID'] });
            }
            await borrowandreturn.bulkCreate(resObjBody).then(outp => res.json(outp));
        } else {
            res.json({ msg: `Bad Request.` })
        }
    } catch (error) {
        console.log('Error:', error);
        res.send(error);
    }
};

exports.updateReturn_and_createReceipt_Data = async (req, res) => {
    try {
        const { brcd } = req.body;
        let datenow = moment().format('YYYY-MM-DD HH:mm:ss');
        if (brcd != null && brcd != '') {
            let Results = {};
            const bnrdata = await borrowandreturn.findOne({ where: { Barcode: brcd } });
            const finebaht = moment().diff(moment(bnrdata.Returns), 'days') * 1;

            ////// เช็ครายการยืมที่เกินกำหนด //////
            if (finebaht != null && finebaht != '' && finebaht != undefined && finebaht > 0) {
                await fine_reciept.create({
                    bnr_ID: bnrdata.bnr_ID,
                    receipt_NO: null,
                    Amount: finebaht,
                    fine_type: 'เกินกำหนด',
                    IsPaid: 'ค้างชำระ',
                    Description: null
                }).then(addrecpt => Results.ReceiptData = addrecpt)
            }
            //////////////////////////////////

            const updBnR = await borrowandreturn.update(
                { Due: datenow },
                { where: { Barcode: brcd } }
            ).then(updBnR => Results.BorrownReturnData = updBnR);
            const updDBI = await databib_item.update(
                { item_status: 'Available' },
                { where: { Barcode: brcd } }
            ).then(updDBI => Results.DatabibItemData = updDBI);
            if (updBnR && updDBI) {
                res.json({
                    status: 200,
                    Results: Results,
                    msg: `Item ${brcd} has Returned `
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

exports.updateReturn_and_createReceipt_Data_Multiple = async (req, res) => {
    try {
        const { Barcode } = req.body;
        let datenow = moment().format('YYYY-MM-DD HH:mm:ss');
        if (Barcode != null && Barcode != '') {
            let Results = {};
            let finedata = [];

            ////// เช็ครายการยืมที่เกินกำหนด ถ้ารายการไหนเกิน ให้บันทึกค่าปรับ //////
            await borrowandreturn.findAll({ where: { Barcode: Barcode } }).then(bnrdata=>{
                bnrdata.map(dataval=>{
                    const finebaht = moment().diff(moment(dataval.Returns), 'days') * 1; ////// วันละ 1 บาท
                    if (finebaht != null && finebaht != '' && finebaht != undefined && finebaht > 0) {
                            finedata.push({
                            bnr_ID: dataval.bnr_ID,
                            receipt_NO: null,
                            Amount: finebaht,
                            fine_type: "เกินกำหนด",
                            IsPaid: "ค้างชำระ",
                            Description: null,
                            });
                    }
                })
                fine_reciept.bulkCreate(finedata).then(addrecpt => Results.ReceiptData = addrecpt);
                console.log(finedata);
            });
            //////////////////////////////////

            const updBnR = await borrowandreturn.update(
                { Due: datenow },
                { where: { Barcode: Barcode } }
            ).then(updBnR => Results.BorrownReturnData = updBnR);
            const updDBI = await databib_item.update(
                { item_status: 'Available' },
                { where: { Barcode: Barcode } }
            ).then(updDBI => Results.DatabibItemData = updDBI);
            if (updBnR && updDBI) {
                res.json({
                    response: "OK",
                    Results: Results,
                    msg: `Item ${Barcode} has Returned `
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

exports.Update_FineReceipt = async (req, res) => {
    try {
        const { receipt_ID, Description } = req.body;
        let genReceiptNo = await fine_reciept.sequelize.query(
            'SELECT MAX(receipt_NO) AS maxReceipt_NO FROM fine_reciepts ',
            { type: fine_reciept.sequelize.QueryTypes.SELECT }
        );
        genReceiptNo = invno.InvoiceNumber.next(genReceiptNo[0]['maxReceipt_NO']);
        console.log(genReceiptNo);
        await fine_reciept.update(
            {
                receipt_NO: genReceiptNo,
                IsPaid: 'ชำระแล้ว',
                Description: Description != '' ? Description : null
            },
            { where: { receipt_ID: receipt_ID } }
        ).then(res.json({ msg: "Update Success." })).catch(e => res.json(e));
    } catch (e) {
        throw e;
    }
};

exports.List_All_FineReceipt = async (req, res) => {
    try {
        await fine_reciept.sequelize.query(
            " SELECT `fine_reciept`.`receipt_ID`,`fine_reciept`.`bnr_ID`,`borrowandreturn`.`Due`,`borrowandreturn`.`Due`,`borrowandreturn`.`Returns`,`fine_reciept`.`receipt_NO`,`fine_reciept`.`Amount` ,`fine_reciept`.`fine_type` ,`fine_reciept`.`IsPaid`,`fine_reciept`.`fine_type` ,`fine_reciept`.`Description` ,`databib`.`Subfield` AS `namebooks` FROM `fine_reciepts` AS `fine_reciept` LEFT OUTER JOIN `borrowandreturns` AS `borrowandreturn` ON `fine_reciept`.`bnr_ID` = `borrowandreturn`.`bnr_ID` LEFT OUTER JOIN `databibs` AS `databib` ON `borrowandreturn`.`Bib_ID` = `databib`.`Bib_ID` AND `databib`.`Field` = '245'  WHERE (`borrowandreturn`.`Member_ID` = '" + req.params.memid + "')",
            { type: fine_reciept.sequelize.QueryTypes.SELECT }
        ).then((dfin) => {
            if (dfin.lenght != 0) {
                dfin.map((data) => {
                    Object.assign(data, { 'datediff': moment(data.Due).diff(moment(data.Returns), 'days') + ' วัน' });
                    data.namebooks = helper.subfReplaceToBlank(data.namebooks);
                    data.Due= moment(data.Due).format('ll');
                    data.Returns= moment(data.Returns).format('ll');
                    data.Amount= data.Amount +' บาท';
                });
                res.json({ 'finebooks': dfin });
            } else {
                res.json({ 'finebooks': 'ไม่พบรายการค่าปรับ' });
            }
        })
    } catch (e) {
        throw e;
    }
};