const { allmembers } = require('../models');
const { Op } = require('sequelize');

exports.list_user_login = (req, res) => {
    try {
        allmembers.findOne({
            attributes: ['member_ID', 'FName', 'LName', 'Position', 'mem_type'],
            where: {
                Username: req.body.username,
                Password: req.body.password
            }
        }).then(outp => res.send(outp));
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

exports.list_userinfo_toEdit = (req, res) => {
    try {
        allmembers.findOne({
            attributes: ['member_ID', 'mem_Citizenid', 'FName', 'LName', 'Position', 'Class', 'Classroom'],
            where: {
                member_ID: req.params.memid
            }
        }).then(outp => res.send(outp));
    } catch (e) {
        console.log(e);
        throw e;
    }
};

exports.update_edit_user = (req, res) => {
    try {
        const { memid, cityid, firstname, lastname, cls, clsroom } = req.body;
        allmembers.update(
            {
                mem_Citizenid: cityid,
                FName: firstname,
                LName: lastname,
                Class: cls,
                Classroom: clsroom
            },
            { where: { member_ID: memid } }
        ).then(res.json({ msg: 'User Updated.' }));
    } catch (e) {
        console.log(e);
        throw e;
    }
};

exports.list_All_UserData_toManage = (req, res) => {
    try {
         allmembers.findAll({
            attributes: ['member_ID', 'mem_Citizenid', 'FName', 'LName', 'Position', 'Class', 'Classroom'],
        }).then((output)=>res.json(output));
    } catch (e) {
        console.log(e);
        throw e;
    }
};

exports.create_New_User = async (req, res) => {
    try {
        const { userid, citicenid, firstname, lastname, cls, clsroom, memtype } = req.body;
        var role = 'student';
        if (memtype == '1') {
            role = 'teacher';
        } else {
            role = 'student';
        }
        // console.log(req.body,role);
        await allmembers.create({
            member_ID: userid,
            mem_Citizenid: citicenid,
            FName: firstname,
            LName: lastname,
            Username: userid,
            Password: citicenid,
            Position: role,
            mem_type: memtype,
            Class: cls,
            Classroom: clsroom
        }).then(responses => {
            res.json({
                status: 200,
                Results: responses,
                msg: `User has been Added.`
            })
        });
    } catch (error) {
        console.log('Error:', error);
        res.send(error);

    }
};