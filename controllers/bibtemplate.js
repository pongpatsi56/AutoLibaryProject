const { template, temp_databib } = require('../models');
const { default: ShortUniqueId } = require('short-unique-id');
const helper = require('../helper/stringHelper')

exports.list_select_template = (req, res) => {
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

exports.create_template_databib = async (req, res) => {
    try {
        const uid = new ShortUniqueId();
        const genuid = uid(10);
        const tempBibObj = req.body.datatemp;
        const tempPlate = req.body.template;
        if (tempBibObj && tempBibObj != null && tempBibObj != '' && tempPlate && tempPlate != null && tempPlate != '') {
            /////////// Add Template //////////////
            Object.assign(tempPlate[0], { "template_ID": genuid });
            // await template.bulkCreate({tempPlate}).then(addtemp => res.json(addtemp));
            ///////////////////////////////////////

            ////////Add Databib Template////////
            for (const key in tempBibObj) {
                Object.assign(tempBibObj[key], { "template_ID": genuid });
                let strSubfield = '';
                for (const [run, value] of Object.entries(tempBibObj[key]["Subfield"])) {
                    strSubfield += `${run}${value}`;
                }
                tempBibObj[key]["Subfield"] = strSubfield;
            }
            // console.log(tempPlate);
            // console.log(tempBibObj);
            await template.bulkCreate(tempPlate).then(() => {
                temp_databib.bulkCreate(tempBibObj).then(outp => res.json(outp));
            });
            ////////////////////////////////////
        } else {
            res.json({ msg: `Bad Request.` })
        }
        // res.send(genBibId);
    } catch (e) {
        console.log(e);
        throw e;
    }
};

exports.delete_template_databib = async (req, res) => {
    try {
    var idTemp = '';
    var idTempDatabib = [];
    ///////////// find template //////////////////////////
    await template.findAll({
        attributes: ['template_ID'],
        include: [
            {
                model: temp_databib,
                attributes:['tempdatabib_ID'],
                required: false
            }
        ],
        where: {
            template_ID: req.params.templateId
        }
    }).then(resource =>{
        idTempDatabib = resource[0].temp_databibs.map(val=>{
            return val.tempdatabib_ID;
        });
        idTemp = resource[0].template_ID;
    })

    ///////////// go Delete ////////////////////
    await template.destroy({
        where: {
            template_ID: idTemp
        }
    }).then(() => {
        temp_databib.destroy({
            where: {
                tempdatabib_ID: idTempDatabib
            }
        }).then(res.json({response:'OK',msg:'Delete Success.'}))
    });
    } catch (e) {
        console.log(e);
        throw e;
    }
};
