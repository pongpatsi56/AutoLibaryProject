const { template, temp_databib } = require('../models');
const { Op } = require('sequelize');
const helper = require('../helper/stringHelper')

exports.list_templatebyId = async (req, res) => {
    try {
        const Keyword = req.params.keyword != null ? req.params.keyword : '';
        await template.findAll({
            attributes: ['template_ID', 'Name', 'Type', 'Description'],
            include: [
                {
                    model: temp_databib,
                    required: false
                }
            ],
            where: {
                Name: {
                    [Op.substring]: Keyword
                }
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
