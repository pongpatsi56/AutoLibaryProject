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

exports.check_memid = async (req, res) => {
    try {
       const Is_check  = await allmembers.findOne({
            where: {
                member_ID: req.params.memid
            }
        });
        if (Is_check != null && Is_check != undefined && Is_check != '') {
            res.json({ IsMemberId: true });
        } else {
            res.json({ IsMemberId: false });
        }
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};

exports.list_userinfo_toEdit = async (req, res) => {
    try {
        const userdata = await allmembers.findOne({
            attributes: ['member_ID', 'mem_Citizenid', 'FName', 'LName', 'Position', 'Class', 'Classroom','mem_type'],
            where: {
                member_ID: req.params.memid
            }
        });
        if (userdata != null && userdata != undefined && userdata != '') {
            res.json(userdata);
        } else {
            res.json({ msg: "User not found." });
        }
    } catch (e) {
        console.log(e);
        throw e;
    }
};

exports.update_edituser_byuser = (req, res) => {
    try {
        const { member_ID, mem_Citizenid, FName, LName, Class, Classroom } = req.body;
        allmembers.update(
            {
                mem_Citizenid: mem_Citizenid,
                FName: FName,
                LName: LName,
                Class: Class,
                Classroom: Classroom
            },
            { where: { member_ID: member_ID } }
        ).then(res.json({ msg: 'User Updated.' }));
    } catch (e) {
        console.log(e);
        throw e;
    }
};

exports.update_edituser_bylib = (req, res) => {
    try {
        const { member_ID, mem_Citizenid, FName, LName, Class, Classroom , mem_type } = req.body;
        var role = 'student';
        if (mem_type == '1') {
            role = 'personnel';
        } else {
            role = 'student';
        }
        allmembers.update(
            {
                mem_Citizenid: mem_Citizenid,
                FName: FName,
                LName: LName,
                Class: Class,
                Classroom: Classroom,
                Position: role,
                mem_type: mem_type
            },
            { where: { member_ID: member_ID } }
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
        }).then((output) => res.json(output));
    } catch (e) {
        console.log(e);
        throw e;
    }
};

exports.create_New_User = async (req, res) => {
    try {
        const { member_ID, mem_Citizenid, FName, LName, Class, Classroom, mem_type } = req.body;
        var role = 'student';
        if (mem_type == '1') {
            role = 'personnel';
        } else {
            role = 'student';
        }
        // console.log(req.body,role);
        await allmembers.create({
            member_ID: member_ID,
            mem_Citizenid: mem_Citizenid,
            FName: FName,
            LName: LName,
            Username: member_ID,
            Password: mem_Citizenid,
            Position: role,
            mem_type: mem_type,
            Class: Class,
            Classroom: Classroom
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

exports.delete_User = (req, res) => {
    allmembers.destroy({
        where: {
            member_ID: req.params.id
        }
    }).then(() => res.send("User has Deleted."));
};