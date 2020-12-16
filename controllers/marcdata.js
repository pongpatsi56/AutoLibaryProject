const { field, subfield, indicator } = require('../models');

exports.marc_add_helper = (req, res) => {
    try {
        field.findAll({
            attributes: ['Field', 'Name'],
            include: [
                {
                    model: indicator, as: 'indicator1',
                    attributes: ['Code', 'Description'],
                    where: { Order: '1' },
                    required:false
                },
                {
                    model: indicator, as: 'indicator2',
                    attributes: ['Code', 'Description'],
                    where: { Order: '2' },
                    required:false
                },
                {
                    model: subfield,
                    attributes: ['Code', 'Name_Eng'],
                    required:false
                }
            ],
            where: {
                Field: req.params.tag
            }
        }).then(outp => res.send(outp));
    } catch (e) {
        console.log(e);
        return res.status(500).json(e);
    }
};
