const { allmembers } = require('../models');
const { Op } = require('sequelize');
const md5 = require('md5');
const jwt = require('jsonwebtoken');
const fs = require('fs') ;

exports.genPassMD5 = (req, res) => {
  try {
    res.send(md5(req.body.pass));
  } catch (e) {
    console.log(e);
    throw e;
  }
};

exports.list_user_login = (req, res) => {
    try {
        allmembers.sequelize.query(
            'SELECT member_ID,mem_Citizenid,FName,LName,Position,profile_img,Class,Classroom FROM allmembers WHERE Username = "' + req.body.username + '" AND Password = "' + md5(req.body.password) + '"',
            { type: allmembers.sequelize.QueryTypes.SELECT }
        )
        // .then((maxBibId) => {
        //     // Object.assign(maxBibId,{maxID : parseInt(maxID) + 1})
        //     res.send(maxBibId);
        // })
        // allmembers.findOne({
        //     attributes: ['member_ID', 'FName', 'LName', 'Position'],
        //     where: {
        //         Username: req.body.username,
        //         Password: md5(req.body.password)
        //     }
        // })
        .then(Data => {
            if (Data != null && Data != "") {
                const accessToken = jwt.sign({Data}, fs.readFileSync(__dirname+'/../middleware/private.key'))
              res.status(200).json({
                  status:200,
                  response:'OK',
                  message:'Success',
                  accessToken:accessToken,
                  Data
              });
            } else {
              res.status(200).json({
                status:200,
                response:'False',
                message:'Invalid Username or Password.'
            });
            }
        });
    } catch (e) {
        console.log(e);
        throw e;
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
        let userdata = await allmembers.findOne({
            attributes: ['member_ID', 'mem_Citizenid', 'FName', 'LName', 'Position', 'Class', 'Classroom','profile_img'],
            where: {
                member_ID: req.params.memid
            }
        });
        if (userdata != null && userdata != undefined && userdata != '') {
            userdata['profile_img'] = (userdata['profile_img'] != null && userdata['profile_img'] != '') ? userdata['profile_img'] : 'https://i.imgur.com/A44vyNC.png'
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
        const { member_ID, mem_Citizenid, FName, LName, Class, Classroom, profile_img } = req.body;
        allmembers.update(
            {
                mem_Citizenid: mem_Citizenid,
                FName: FName,
                LName: LName,
                Class: Class,
                Classroom: Classroom,
                profile_img: profile_img
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
        const { member_ID, mem_Citizenid, FName, LName, Class, Classroom , Position, profile_img } = req.body;
        allmembers.update(
            {
                mem_Citizenid: mem_Citizenid,
                FName: FName,
                LName: LName,
                Class: Class,
                Classroom: Classroom,
                Position: Position,
                profile_img:profile_img
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
            attributes: ['member_ID', 'mem_Citizenid', 'FName', 'LName', 'Position', 'Class', 'Classroom', 'profile_img'],
            where: {
                Position: {
                    [Op.or]: ['student', 'personnel']
                  }
            },
            order:['member_ID']
        }).then((output) => res.json(output));
    } catch (e) {
        console.log(e);
        throw e;
    }
};
exports.list_All_UserData_AdminManage = (req, res) => {
    try {
        allmembers.findAll({
            attributes: ['member_ID', 'mem_Citizenid', 'FName', 'LName', 'Position', 'Class', 'Classroom', 'profile_img'],
            where: {
                Position: {
                    [Op.or]: ['librarian', 'student', 'personnel']
                  }
            },
            order:['Position']
        }).then((output) => res.json(output));
    } catch (e) {
        console.log(e);
        throw e;
    }
};

exports.create_New_User = async (req, res) => {
    try {
        const { member_ID, mem_Citizenid, FName, LName, Class, Classroom, Position, profile_img  } = req.body;
        await allmembers.create({
            member_ID: member_ID,
            mem_Citizenid: mem_Citizenid,
            FName: FName,
            LName: LName,
            Username: member_ID,
            Password: mem_Citizenid,
            Position: Position,
            Class: Class,
            Classroom: Classroom,
            profile_img:profile_img
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