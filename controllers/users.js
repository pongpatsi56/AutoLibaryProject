const { allmembers } = require('../models');

exports.list_user_login = (req, res) => {
    try {
        allmembers.findOne({
            attributes: ['member_ID','FName', 'LName','Position','mem_type'],
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
