const { template, temp_databib } = require('../models');
// const { Op } = require('sequelize');
const helper = require('../helper/stringHelper')

exports.list_select_template = (req,res) =>{
    try {
        template.findAll({}).then(outp => res.send(outp));
    } catch (e) {
        throw e;
    }
};

exports.list_templatebyId = async (req, res) => {
    try {
        await template.findAll({
            attributes: ['template_ID', 'Name', 'Type', 'Description'],
            include: [
                {
                    model: temp_databib,
                    required: false
                }
            ],
            where: {
                template_ID: req.params.templateId
            }
        }).then((db) => {
            if (db) {
                for (const val of db[0].temp_databibs) {
                    val.Subfield = helper.subfloopToObject(val.Subfield)
                };
            }
            res.send(db);
        });
    } catch (e) {
        console.log(e);
        throw e;
    }
};
